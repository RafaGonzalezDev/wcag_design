export interface ColorPalette {
  id: string;
  name: string;
  foreground: string;
  background: string;
  contrastRatio: number;
  wcagLevel: 'AA' | 'AAA' | 'FAIL';
  isAccessible: boolean;
}

export interface WCAGResult {
  contrastRatio: number;
  level: 'AA' | 'AAA' | 'FAIL';
  isAccessible: boolean;
  recommendations?: string[];
}

export interface ColorInput {
  foreground: string;
  background: string;
}

export type WCAGLevel = 'AA' | 'AAA';

export interface AccessibilityCheck {
  normalText: {
    aa: boolean;
    aaa: boolean;
  };
  largeText: {
    aa: boolean;
    aaa: boolean;
  };
}