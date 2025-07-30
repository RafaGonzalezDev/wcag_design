import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Palette, Lightbulb, Shuffle, Star, Copy, TestTube } from 'lucide-react';
import { checkWCAGCompliance, isValidHexColor } from '@/lib/wcag-utils';
import type { WCAGResult } from '@/types/wcag';
import { toast } from 'sonner';

// Paletas minimalistas y modernas conformes con WCAG 2.1 AA
const PREDEFINED_PALETTES = {
  'Neutrales Cálidos': [
    { name: 'Wood for Winter', foreground: '#DCCCBD', background: '#021825' },
    { name: 'La Renard', foreground: '#CCBCAD', background: '#383931' },
    { name: 'Library Leather', foreground: '#F7E7CE', background: '#59372B' },
    { name: 'Put It in Neutral', foreground: '#EDE3D9', background: '#1C2915' },
    { name: 'Champagne Crystal', foreground: '#D6CFBF', background: '#4E4D49' },
    { name: 'Taupe Minimal', foreground: '#C8BFB8', background: '#4E311D' },
  ],
  'Pasteles Modernos': [
    { name: 'Lavender Meadow', foreground: '#EBE6F5', background: '#463769' },
    { name: 'Coastal Breeze', foreground: '#F8F9FA', background: '#0A2E4E' },
    { name: 'Twilight Garden', foreground: '#FFF4E0', background: '#3D3232' },
    { name: 'Tropical Morning', foreground: '#F9F9F1', background: '#354E67' },
    { name: 'Blossoms', foreground: '#F7F7EE', background: '#2F4027' },
    { name: 'Serenity', foreground: '#F5F1E1', background: '#7D6754' },
  ],
  'Tonos Tierra Suaves': [
    { name: 'Bohemian Sun', foreground: '#FFF8F0', background: '#685555' },
    { name: 'Nautilus Fossil', foreground: '#CBC7BB', background: '#42201F' },
    { name: 'Vintage Vault', foreground: '#CECDC9', background: '#180B02' },
    { name: 'Gray + Gold Gears', foreground: '#F6EEE3', background: '#3F3832' },
    { name: 'Oatmeal Sweater', foreground: '#F1E3BC', background: '#574748' },
    { name: 'Slug Bug', foreground: '#D3DCDB', background: '#2B3029' },
  ],
  'Azules y Grises Minimalistas': [
    { name: 'Forest Mist', foreground: '#EEF3F9', background: '#001B2E' },
    { name: 'La Luna', foreground: '#E9E8EE', background: '#101B39' },
    { name: 'Muted Grays & Blues', foreground: '#000000', background: '#B3CDD7' },
    { name: 'Blue Gray Scheme', foreground: '#FFFFFF', background: '#003B6D' },
    { name: 'UVA Cool Contrast', foreground: '#F1F1EF', background: '#232D4B' },
    { name: 'Muted Grey Blue', foreground: '#000000', background: '#BFDFE7' },
  ],
  'Blanco/Negro con Acento': [
    { name: 'Urban Chic', foreground: '#000000', background: '#FFFFFF' },
    { name: 'Frosted Noir', foreground: '#FFFFFF', background: '#000000' },
    { name: 'Classic Contrast', foreground: '#000000', background: '#C0C0C0' },
    { name: 'Vintage Film', foreground: '#000000', background: '#D9D9D9' },
    { name: 'Minimal Brass Accent', foreground: '#1C1C1C', background: '#FEFDFB' },
    { name: 'Powerful B&W', foreground: '#FFFFFF', background: '#000000' },
  ],
};

interface ColorPaletteGeneratorProps {
  onPaletteChange?: (palette: { foreground: string; background: string }) => void;
}

export function ColorPaletteGenerator({ onPaletteChange }: ColorPaletteGeneratorProps) {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [wcagResult, setWcagResult] = useState<WCAGResult | null>(null);

  const [selectedPredefinedCategory, setSelectedPredefinedCategory] = useState('Neutrales Cálidos');

  // Verificar accesibilidad cuando cambien los colores
  useEffect(() => {
    if (isValidHexColor(foregroundColor) && isValidHexColor(backgroundColor)) {
      const result = checkWCAGCompliance(foregroundColor, backgroundColor);
      setWcagResult(result);
      // Notificar cambio de paleta al componente padre
      onPaletteChange?.({ foreground: foregroundColor, background: backgroundColor });
    } else {
      setWcagResult(null);
    }
  }, [foregroundColor, backgroundColor, onPaletteChange]);

  const handleForegroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('#') || value === '') {
      setForegroundColor(value);
    } else {
      setForegroundColor('#' + value);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('#') || value === '') {
      setBackgroundColor(value);
    } else {
      setBackgroundColor('#' + value);
    }
  };

  const handleColorPickerChange = (type: 'foreground' | 'background', color: string) => {
    if (type === 'foreground') {
      setForegroundColor(color);
    } else {
      setBackgroundColor(color);
    }
  };

  const selectPredefinedPalette = (palette: { name: string; foreground: string; background: string }) => {
    setForegroundColor(palette.foreground);
    setBackgroundColor(palette.background);
    // Mostrar toast de notificación
     toast.success('Tema aplicado correctamente', {
       description: '¡Dirígete a la pestaña de pruebas!',
     });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateRandomAccessiblePalette = () => {
    const colors = ['#1976d2', '#2e7d32', '#d32f2f', '#f57c00', '#9c27b0', '#00796b', '#5d4037', '#455a64'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setForegroundColor(randomColor);
    setBackgroundColor('#ffffff');
  };

  const getComplianceProgress = () => {
    if (!wcagResult) return 0;
    if (wcagResult.level === 'AAA') return 100;
    if (wcagResult.level === 'AA') return 75;
    return wcagResult.contrastRatio >= 3 ? 50 : 25;
  };

  const swapColors = () => {
    const temp = foregroundColor;
    setForegroundColor(backgroundColor);
    setBackgroundColor(temp);
  };

  return (
    <div className="container mx-auto p-2 max-w-7xl">
      {/* Header con información contextual */}
      <div className="mb-8">
        <Alert className="mb-6">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>Explora paletas de colores accesibles basadas en sistemas de diseño reconocidos.</AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Crear Paleta</TabsTrigger>
          <TabsTrigger value="predefined">Paletas Recomendadas</TabsTrigger>
          <TabsTrigger value="testing">Pruebas</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="space-y-6">
            {/* Panel de Control Mejorado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Analizador de Contraste WCAG
                </CardTitle>
                <CardDescription>Diseña combinaciones personalizadas con validación WCAG en tiempo real</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Paleta Seleccionada */}
                {wcagResult && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: foregroundColor }} />
                      <span className="text-sm font-medium">{foregroundColor}</span>
                      <span className="text-muted-foreground text-sm">Texto</span>
                      <div className="w-6 h-6 rounded border ml-4" style={{ backgroundColor: backgroundColor }} />
                      <span className="text-sm font-medium">{backgroundColor}</span>
                      <span className="text-muted-foreground text-sm">Fondo</span>
                    </div>
                  </div>
                )}

                {/* Ratio de Contraste */}
                {wcagResult && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ratio de Contraste</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{wcagResult.contrastRatio}:1</span>
                        <Badge variant={wcagResult.level === 'AAA' ? 'default' : wcagResult.level === 'AA' ? 'secondary' : 'destructive'} className="text-xs">
                          WCAG {wcagResult.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Barra de progreso de cumplimiento */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cumplimiento de Accesibilidad</span>
                        <span className="font-medium">{getComplianceProgress()}%</span>
                      </div>
                      <Progress value={getComplianceProgress()} className="h-2" />
                    </div>

                    {/* Niveles de cumplimiento */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className={`p-3 rounded-lg border ${wcagResult.contrastRatio >= 3 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-xs font-medium">AA Grande</div>
                        <div className="text-xs text-muted-foreground">≥ 3:1</div>
                        <div className="text-sm">{wcagResult.contrastRatio >= 3 ? '✓ Cumple' : '✗ No cumple'}</div>
                      </div>
                      <div className={`p-3 rounded-lg border ${wcagResult.contrastRatio >= 4.5 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-xs font-medium">AA Normal</div>
                        <div className="text-xs text-muted-foreground">≥ 4.5:1</div>
                        <div className="text-sm">{wcagResult.contrastRatio >= 4.5 ? '✓ Cumple' : '✗ No cumple'}</div>
                      </div>
                      <div className={`p-3 rounded-lg border ${wcagResult.contrastRatio >= 7 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-xs font-medium">AAA</div>
                        <div className="text-xs text-muted-foreground">≥ 7:1</div>
                        <div className="text-sm">{wcagResult.contrastRatio >= 7 ? '✓ Cumple' : '✗ No cumple'}</div>
                      </div>
                    </div>

                    {/* Recomendaciones */}
                    {wcagResult.recommendations && wcagResult.recommendations.length > 0 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <h4 className="font-medium text-sm text-amber-800 mb-2">💡 Recomendaciones</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                          {wcagResult.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">•</span>
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Selectores de Color */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="foreground" className="flex items-center gap-2">
                      Color de Texto
                      <Badge variant="outline" className="text-xs">
                        {foregroundColor}
                      </Badge>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="foreground"
                        type="color"
                        value={isValidHexColor(foregroundColor) ? foregroundColor : '#000000'}
                        onChange={(e) => handleColorPickerChange('foreground', e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input type="text" value={foregroundColor} onChange={handleForegroundChange} placeholder="#000000" className="flex-1" />
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(foregroundColor)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background" className="flex items-center gap-2">
                      Color de Fondo
                      <Badge variant="outline" className="text-xs">
                        {backgroundColor}
                      </Badge>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="background"
                        type="color"
                        value={isValidHexColor(backgroundColor) ? backgroundColor : '#ffffff'}
                        onChange={(e) => handleColorPickerChange('background', e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input type="text" value={backgroundColor} onChange={handleBackgroundChange} placeholder="#ffffff" className="flex-1" />
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(backgroundColor)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={swapColors} variant="outline" className="w-full">
                    Intercambiar
                  </Button>
                  <Button onClick={generateRandomAccessiblePalette} disabled={!isValidHexColor(foregroundColor)} className="w-full">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Paleta Aleatoria
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predefined" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Paletas Recomendadas por Expertos
              </CardTitle>
              <CardDescription>
                Paletas oficiales de sistemas gubernamentales y corporativos verificadas para cumplir WCAG 2.1 AA. Cada combinación incluye roles de uso recomendados para facilitar la integración.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(PREDEFINED_PALETTES).map((category) => (
                    <Button key={category} variant={selectedPredefinedCategory === category ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPredefinedCategory(category)}>
                      {category}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PREDEFINED_PALETTES[selectedPredefinedCategory as keyof typeof PREDEFINED_PALETTES]?.map((palette, index) => {
                    const result = checkWCAGCompliance(palette.foreground, palette.background);
                    return (
                      <div key={index} className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => selectPredefinedPalette(palette)}>
                        <div className="h-20 flex items-center justify-center text-sm font-medium" style={{ backgroundColor: palette.background, color: palette.foreground }}>
                          {palette.name}
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">{palette.name}</span>
                            <Badge variant={result.level === 'AAA' ? 'default' : result.level === 'AA' ? 'secondary' : 'destructive'} className="text-xs">
                              {result.level}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">Contraste: {result.contrastRatio}:1</div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-6 px-2 w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(`Texto: ${palette.foreground}, Fondo: ${palette.background}`);
                              selectPredefinedPalette(palette);
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar y Aplicar
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Simulación de Interfaz
              </CardTitle>
              <CardDescription>Evalúa la paleta actual en contextos reales de interfaz de usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Dashboard Example */}
                <div
                  className="p-6 rounded-lg border-2"
                  style={{
                    backgroundColor: backgroundColor,
                    color: foregroundColor,
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Panel de Accesibilidad</h2>
                    <Badge
                      style={{
                        backgroundColor: foregroundColor,
                        color: backgroundColor,
                      }}
                    >
                      {wcagResult?.level || 'Sin evaluar'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded border" style={{ borderColor: foregroundColor + '30' }}>
                      <h3 className="font-semibold mb-2">Tests Realizados</h3>
                      <div className="text-3xl font-bold mb-1">247</div>
                      <p className="text-sm opacity-75">Evaluaciones completadas</p>
                    </div>
                    <div className="p-4 rounded border" style={{ borderColor: foregroundColor + '30' }}>
                      <h3 className="font-semibold mb-2">Cumplimiento</h3>
                      <div className="text-3xl font-bold mb-1">{getComplianceProgress()}%</div>
                      <p className="text-sm opacity-75">Nivel de accesibilidad</p>
                    </div>
                    <div className="p-4 rounded border" style={{ borderColor: foregroundColor + '30' }}>
                      <h3 className="font-semibold mb-2">Contraste</h3>
                      <div className="text-3xl font-bold mb-1">{wcagResult?.contrastRatio.toFixed(1) || '0.0'}</div>
                      <p className="text-sm opacity-75">Ratio actual</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      style={{
                        backgroundColor: foregroundColor,
                        color: backgroundColor,
                      }}
                    >
                      Ejecutar Análisis
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2"
                      style={{
                        borderColor: foregroundColor + '80',
                        color: foregroundColor,
                        backgroundColor: 'transparent'
                      }}
                    >
                      Exportar Reporte
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2"
                      style={{
                        borderColor: foregroundColor + '80',
                        color: foregroundColor,
                        backgroundColor: 'transparent'
                      }}
                    >
                      Ver Historial
                    </Button>
                  </div>
                </div>

                {/* Form Example */}
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: backgroundColor,
                    color: foregroundColor,
                    borderColor: foregroundColor + '30'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4">Formulario de Contacto</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre completo</label>
                      <input 
                        type="text" 
                        className="w-full p-3 rounded border" 
                        style={{
                          backgroundColor: backgroundColor,
                          color: foregroundColor,
                          borderColor: foregroundColor + '50'
                        }}
                        placeholder="Ingresa tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Correo electrónico</label>
                      <input 
                        type="email" 
                        className="w-full p-3 rounded border" 
                        style={{
                          backgroundColor: backgroundColor,
                          color: foregroundColor,
                          borderColor: foregroundColor + '50'
                        }}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Mensaje</label>
                      <textarea 
                        className="w-full p-3 rounded border h-24" 
                        style={{
                          backgroundColor: backgroundColor,
                          color: foregroundColor,
                          borderColor: foregroundColor + '50'
                        }}
                        placeholder="Escribe tu mensaje aquí..."
                      />
                    </div>
                    <Button 
                      style={{
                        backgroundColor: foregroundColor,
                        color: backgroundColor
                      }}
                    >
                      Enviar Mensaje
                    </Button>
                  </div>
                </div>

                {/* Navigation Example */}
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: backgroundColor,
                    color: foregroundColor,
                    borderColor: foregroundColor + '30'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4">Navegación Principal</h3>
                  <nav className="flex flex-wrap gap-4 mb-4">
                    <a href="#" className="px-4 py-2 rounded hover:opacity-80 transition-opacity" style={{ backgroundColor: foregroundColor, color: backgroundColor }}>Inicio</a>
                    <a href="#" className="px-4 py-2 rounded border hover:opacity-80 transition-opacity" style={{ borderColor: foregroundColor, color: foregroundColor }}>Productos</a>
                    <a href="#" className="px-4 py-2 rounded border hover:opacity-80 transition-opacity" style={{ borderColor: foregroundColor, color: foregroundColor }}>Servicios</a>
                    <a href="#" className="px-4 py-2 rounded border hover:opacity-80 transition-opacity" style={{ borderColor: foregroundColor, color: foregroundColor }}>Contacto</a>
                  </nav>
                  <div className="text-sm opacity-75">
                    <p>Menú de navegación con estados activo y normal</p>
                  </div>
                </div>

                {/* Content Cards Example */}
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: backgroundColor,
                    color: foregroundColor,
                    borderColor: foregroundColor + '30'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4">Tarjetas de Contenido</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded border" style={{ borderColor: foregroundColor + '30' }}>
                      <h4 className="font-semibold mb-2">Artículo Destacado</h4>
                      <p className="text-sm opacity-75 mb-3">Este es un ejemplo de cómo se ve el texto en una tarjeta de contenido con la paleta seleccionada.</p>
                      <a href="#" className="text-sm underline hover:opacity-80">Leer más</a>
                    </div>
                    <div className="p-4 rounded border" style={{ borderColor: foregroundColor + '30' }}>
                      <h4 className="font-semibold mb-2">Notificación</h4>
                      <p className="text-sm opacity-75 mb-3">Información importante que necesita ser legible y accesible para todos los usuarios.</p>
                      <Button 
                        size="sm"
                        style={{
                          backgroundColor: foregroundColor,
                          color: backgroundColor
                        }}
                      >
                        Entendido
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Text Content Example */}
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: backgroundColor,
                    color: foregroundColor,
                    borderColor: foregroundColor + '30'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4">Contenido de Texto</h3>
                  <div className="space-y-4">
                    <p className="text-base leading-relaxed">
                      Este es un ejemplo de párrafo normal que muestra cómo se ve el texto corrido con la paleta de colores seleccionada. 
                      Es importante que el contraste sea suficiente para garantizar la legibilidad.
                    </p>
                    <p className="text-sm opacity-75">
                      Texto secundario con menor opacidad para mostrar jerarquía visual manteniendo la accesibilidad.
                    </p>
                    <blockquote className="border-l-4 pl-4" style={{ borderColor: foregroundColor }}>
                      <p className="italic">"La accesibilidad no es una característica, es un derecho fundamental."</p>
                    </blockquote>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Elemento de lista que debe ser legible</li>
                      <li>Otro elemento con el contraste adecuado</li>
                      <li>Tercer elemento para completar el ejemplo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
