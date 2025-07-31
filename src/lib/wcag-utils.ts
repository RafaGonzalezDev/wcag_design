import type { WCAGResult, AccessibilityCheck, ColorInput } from '@/types/wcag';
import { COLOR_PALETTE_GENERATOR } from '@/constants';

/**
 * Convierte un color hexadecimal a RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calcula la luminancia relativa de un color
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcula el ratio de contraste entre dos colores
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Verifica si una combinación de colores cumple con los estándares WCAG
 */
export function checkWCAGCompliance(foreground: string, background: string): WCAGResult {
  const contrastRatio = getContrastRatio(foreground, background);
  
  const accessibility: AccessibilityCheck = {
    normalText: {
      aa: contrastRatio >= 4.5,
      aaa: contrastRatio >= 7,
    },
    largeText: {
      aa: contrastRatio >= 3,
      aaa: contrastRatio >= 4.5,
    },
  };

  let level: 'AA' | 'AAA' | 'FAIL' = 'FAIL';
  let isAccessible = false;

  if (accessibility.normalText.aaa && accessibility.largeText.aaa) {
    level = 'AAA';
    isAccessible = true;
  } else if (accessibility.normalText.aa && accessibility.largeText.aa) {
    level = 'AA';
    isAccessible = true;
  }

  const recommendations: string[] = [];
  
  if (!isAccessible) {
    if (contrastRatio < 3) {
      recommendations.push(COLOR_PALETTE_GENERATOR.WCAG_RECOMMENDATIONS.LOW_CONTRAST);
    } else if (contrastRatio < 4.5) {
      recommendations.push(COLOR_PALETTE_GENERATOR.WCAG_RECOMMENDATIONS.LARGE_TEXT_ONLY);
    }
    
    const rgb1 = hexToRgb(foreground);
    const rgb2 = hexToRgb(background);
    
    if (rgb1 && rgb2) {
      const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
      const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
      
      if (lum1 > lum2) {
        recommendations.push(COLOR_PALETTE_GENERATOR.WCAG_RECOMMENDATIONS.DARKEN_FOREGROUND);
      } else {
        recommendations.push(COLOR_PALETTE_GENERATOR.WCAG_RECOMMENDATIONS.LIGHTEN_FOREGROUND);
      }
    }
  }

  return {
    contrastRatio: Math.round(contrastRatio * 100) / 100,
    level,
    isAccessible,
    recommendations: recommendations.length > 0 ? recommendations : undefined,
  };
}

/**
 * Genera una paleta de colores accesibles basada en un color base
 */
export function generateAccessiblePalette(baseColor: string): ColorInput[] {
  const palettes: ColorInput[] = [];
  const seen = new Set<string>();
  
  // Colores de fondo comunes
  const backgrounds = ['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#212529', '#000000'];
  
  // Generar variaciones del color base
  const rgb = hexToRgb(baseColor);
  if (!rgb) return palettes;
  
  const variations = [
    baseColor.toLowerCase(),
    // Versión más oscura
    `#${Math.max(0, rgb.r - 40).toString(16).padStart(2, '0')}${Math.max(0, rgb.g - 40).toString(16).padStart(2, '0')}${Math.max(0, rgb.b - 40).toString(16).padStart(2, '0')}`,
    // Versión más clara
    `#${Math.min(255, rgb.r + 40).toString(16).padStart(2, '0')}${Math.min(255, rgb.g + 40).toString(16).padStart(2, '0')}${Math.min(255, rgb.b + 40).toString(16).padStart(2, '0')}`,
  ];
  
  backgrounds.forEach(bg => {
    variations.forEach(fg => {
      const normalizedFg = fg.toLowerCase();
      const normalizedBg = bg.toLowerCase();
      const key = `${normalizedFg}-${normalizedBg}`;
      
      // Evitar duplicados
      if (seen.has(key)) return;
      
      const result = checkWCAGCompliance(normalizedFg, normalizedBg);
      if (result.isAccessible) {
        seen.add(key);
        palettes.push({ foreground: normalizedFg, background: normalizedBg });
      }
    });
  });
  
  return palettes;
}

/**
 * Valida si un string es un color hexadecimal válido
 */
export function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Normaliza un color hexadecimal (convierte formato corto a largo)
 */
export function normalizeHexColor(hex: string): string {
  if (hex.length === 4) {
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
}