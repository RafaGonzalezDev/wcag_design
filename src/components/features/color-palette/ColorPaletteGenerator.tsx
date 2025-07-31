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
import { COLOR_PALETTE_GENERATOR, PALETTE_CATEGORIES, PREDEFINED_PALETTES } from '@/constants';



interface ColorPaletteGeneratorProps {
  onPaletteChange?: (palette: { foreground: string; background: string }) => void;
}

export function ColorPaletteGenerator({ onPaletteChange }: ColorPaletteGeneratorProps) {
  const [foregroundColor, setForegroundColor] = useState(COLOR_PALETTE_GENERATOR.PLACEHOLDERS.HEX_BLACK);
  const [backgroundColor, setBackgroundColor] = useState(COLOR_PALETTE_GENERATOR.PLACEHOLDERS.HEX_WHITE);
  const [wcagResult, setWcagResult] = useState<WCAGResult | null>(null);

  const [selectedPredefinedCategory, setSelectedPredefinedCategory] = useState(PALETTE_CATEGORIES.WARM_NEUTRALS);

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
     toast.success(COLOR_PALETTE_GENERATOR.MESSAGES.THEME_APPLIED, {
       description: COLOR_PALETTE_GENERATOR.MESSAGES.GO_TO_TESTS,
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
          <AlertDescription>{COLOR_PALETTE_GENERATOR.DESCRIPTIONS.CONTEXTUAL_INFO}</AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">{COLOR_PALETTE_GENERATOR.TABS.CREATE}</TabsTrigger>
          <TabsTrigger value="predefined">{COLOR_PALETTE_GENERATOR.TABS.PREDEFINED}</TabsTrigger>
          <TabsTrigger value="testing">{COLOR_PALETTE_GENERATOR.TABS.TESTING}</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="space-y-6">
            {/* Panel de Control Mejorado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {COLOR_PALETTE_GENERATOR.TITLES.MAIN_TITLE}
                </CardTitle>
                <CardDescription>{COLOR_PALETTE_GENERATOR.DESCRIPTIONS.MAIN_DESCRIPTION}</CardDescription>
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
                      <span className="text-sm font-medium">{COLOR_PALETTE_GENERATOR.LABELS.CONTRAST_RATIO}</span>
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
                        <span>{COLOR_PALETTE_GENERATOR.LABELS.ACCESSIBILITY_COMPLIANCE}</span>
                        <span className="font-medium">{getComplianceProgress()}%</span>
                      </div>
                      <Progress value={getComplianceProgress()} className="h-2" />
                    </div>

                    {/* Niveles de cumplimiento */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className={`p-3 rounded-lg border ${wcagResult.contrastRatio >= 3 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-xs font-medium">{COLOR_PALETTE_GENERATOR.WCAG_LEVELS.AA_LARGE}</div>
                        <div className="text-xs text-muted-foreground">≥ 3:1</div>
                        <div className="text-sm">{wcagResult.contrastRatio >= 3 ? COLOR_PALETTE_GENERATOR.WCAG_LEVELS.COMPLIES : COLOR_PALETTE_GENERATOR.WCAG_LEVELS.NOT_COMPLIES}</div>
                      </div>
                      <div className={`p-3 rounded-lg border ${wcagResult.contrastRatio >= 4.5 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-xs font-medium">{COLOR_PALETTE_GENERATOR.WCAG_LEVELS.AA_NORMAL}</div>
                        <div className="text-xs text-muted-foreground">≥ 4.5:1</div>
                        <div className="text-sm">{wcagResult.contrastRatio >= 4.5 ? COLOR_PALETTE_GENERATOR.WCAG_LEVELS.COMPLIES : COLOR_PALETTE_GENERATOR.WCAG_LEVELS.NOT_COMPLIES}</div>
                      </div>
                      <div className={`p-3 rounded-lg border ${wcagResult.contrastRatio >= 7 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-xs font-medium">{COLOR_PALETTE_GENERATOR.WCAG_LEVELS.AAA}</div>
                        <div className="text-xs text-muted-foreground">≥ 7:1</div>
                        <div className="text-sm">{wcagResult.contrastRatio >= 7 ? COLOR_PALETTE_GENERATOR.WCAG_LEVELS.COMPLIES : COLOR_PALETTE_GENERATOR.WCAG_LEVELS.NOT_COMPLIES}</div>
                      </div>
                    </div>

                    {/* Recomendaciones */}
                    {wcagResult.recommendations && wcagResult.recommendations.length > 0 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <h4 className="font-medium text-sm text-amber-800 mb-2">{COLOR_PALETTE_GENERATOR.MESSAGES.RECOMMENDATIONS_TITLE}</h4>
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
                      {COLOR_PALETTE_GENERATOR.LABELS.FOREGROUND_COLOR}
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
                      <Input type="text" value={foregroundColor} onChange={handleForegroundChange} placeholder={COLOR_PALETTE_GENERATOR.PLACEHOLDERS.HEX_BLACK} className="flex-1" />
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(foregroundColor)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background" className="flex items-center gap-2">
                      {COLOR_PALETTE_GENERATOR.LABELS.BACKGROUND_COLOR}
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
                      <Input type="text" value={backgroundColor} onChange={handleBackgroundChange} placeholder={COLOR_PALETTE_GENERATOR.PLACEHOLDERS.HEX_WHITE} className="flex-1" />
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(backgroundColor)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={swapColors} variant="outline" className="w-full">
                    {COLOR_PALETTE_GENERATOR.BUTTONS.SWAP_COLORS}
                  </Button>
                  <Button onClick={generateRandomAccessiblePalette} disabled={!isValidHexColor(foregroundColor)} className="w-full">
                    <Shuffle className="h-4 w-4 mr-2" />
                    {COLOR_PALETTE_GENERATOR.BUTTONS.RANDOM_PALETTE}
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
                {COLOR_PALETTE_GENERATOR.TITLES.PREDEFINED_PALETTES}
              </CardTitle>
              <CardDescription>
                {COLOR_PALETTE_GENERATOR.DESCRIPTIONS.PREDEFINED_DESCRIPTION}
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
                  {PREDEFINED_PALETTES[selectedPredefinedCategory as keyof typeof PREDEFINED_PALETTES]?.map((palette: any, index: any) => {
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
                            {COLOR_PALETTE_GENERATOR.BUTTONS.COPY_AND_APPLY}
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
                {COLOR_PALETTE_GENERATOR.TITLES.INTERFACE_SIMULATION}
              </CardTitle>
              <CardDescription>{COLOR_PALETTE_GENERATOR.DESCRIPTIONS.INTERFACE_DESCRIPTION}</CardDescription>
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
                    <h2 className="text-2xl font-bold">{COLOR_PALETTE_GENERATOR.TITLES.ACCESSIBILITY_PANEL_TITLE}</h2>
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
                      <h3 className="font-semibold mb-2">{COLOR_PALETTE_GENERATOR.STATS.TESTS_COMPLETED}</h3>
                      <div className="text-3xl font-bold mb-1">{COLOR_PALETTE_GENERATOR.STATS.EVALUATIONS_COUNT}</div>
                      <p className="text-sm opacity-75">{COLOR_PALETTE_GENERATOR.STATS.EVALUATIONS_DESCRIPTION}</p>
                    </div>
                    <div className="p-4 rounded border" style={{ borderColor: foregroundColor + '30' }}>
                      <h3 className="font-semibold mb-2">{COLOR_PALETTE_GENERATOR.STATS.COMPLIANCE}</h3>
                      <div className="text-3xl font-bold mb-1">{getComplianceProgress()}%</div>
                      <p className="text-sm opacity-75">{COLOR_PALETTE_GENERATOR.STATS.ACCESSIBILITY_LEVEL}</p>
                    </div>
                    <div className="p-4 rounded border" style={{ borderColor: foregroundColor + '30' }}>
                      <h3 className="font-semibold mb-2">{COLOR_PALETTE_GENERATOR.STATS.CONTRAST}</h3>
                      <div className="text-3xl font-bold mb-1">{wcagResult?.contrastRatio.toFixed(1) || '0.0'}</div>
                      <p className="text-sm opacity-75">{COLOR_PALETTE_GENERATOR.STATS.CURRENT_RATIO}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      style={{
                        backgroundColor: foregroundColor,
                        color: backgroundColor,
                      }}
                    >
                      {COLOR_PALETTE_GENERATOR.BUTTONS.RUN_ANALYSIS}
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
                      {COLOR_PALETTE_GENERATOR.BUTTONS.EXPORT_REPORT}
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
                      {COLOR_PALETTE_GENERATOR.BUTTONS.VIEW_HISTORY}
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
                  <h3 className="text-xl font-bold mb-4">{COLOR_PALETTE_GENERATOR.TITLES.CONTACT_FORM}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{COLOR_PALETTE_GENERATOR.FORM_FIELDS.FULL_NAME}</label>
                      <input 
                        type="text" 
                        className="w-full p-3 rounded border" 
                        style={{
                          backgroundColor: backgroundColor,
                          color: foregroundColor,
                          borderColor: foregroundColor + '50'
                        }}
                        placeholder={COLOR_PALETTE_GENERATOR.PLACEHOLDERS.NAME_PLACEHOLDER}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{COLOR_PALETTE_GENERATOR.FORM_FIELDS.EMAIL}</label>
                      <input 
                        type="email" 
                        className="w-full p-3 rounded border" 
                        style={{
                          backgroundColor: backgroundColor,
                          color: foregroundColor,
                          borderColor: foregroundColor + '50'
                        }}
                        placeholder={COLOR_PALETTE_GENERATOR.PLACEHOLDERS.EMAIL_PLACEHOLDER}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{COLOR_PALETTE_GENERATOR.FORM_FIELDS.MESSAGE}</label>
                      <textarea 
                        className="w-full p-3 rounded border h-24" 
                        style={{
                          backgroundColor: backgroundColor,
                          color: foregroundColor,
                          borderColor: foregroundColor + '50'
                        }}
                        placeholder={COLOR_PALETTE_GENERATOR.PLACEHOLDERS.MESSAGE_PLACEHOLDER}
                      />
                    </div>
                    <Button 
                      style={{
                        backgroundColor: foregroundColor,
                        color: backgroundColor
                      }}
                    >
                      {COLOR_PALETTE_GENERATOR.BUTTONS.SEND_MESSAGE}
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
                  <h3 className="text-xl font-bold mb-4">{COLOR_PALETTE_GENERATOR.NAVIGATION.MAIN_NAVIGATION}</h3>
                  <nav className="flex flex-wrap gap-4 mb-4">
                    <a href="#" className="px-4 py-2 rounded hover:opacity-80 transition-opacity" style={{ backgroundColor: foregroundColor, color: backgroundColor }}>{COLOR_PALETTE_GENERATOR.NAVIGATION.HOME}</a>
                    <a href="#" className="px-4 py-2 rounded border hover:opacity-80 transition-opacity" style={{ borderColor: foregroundColor, color: foregroundColor }}>{COLOR_PALETTE_GENERATOR.NAVIGATION.PRODUCTS}</a>
                    <a href="#" className="px-4 py-2 rounded border hover:opacity-80 transition-opacity" style={{ borderColor: foregroundColor, color: foregroundColor }}>{COLOR_PALETTE_GENERATOR.NAVIGATION.SERVICES}</a>
                    <a href="#" className="px-4 py-2 rounded border hover:opacity-80 transition-opacity" style={{ borderColor: foregroundColor, color: foregroundColor }}>{COLOR_PALETTE_GENERATOR.NAVIGATION.CONTACT}</a>
                  </nav>
                  <div className="text-sm opacity-75">
                    <p>{COLOR_PALETTE_GENERATOR.NAVIGATION.DESCRIPTION}</p>
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
                  <h3 className="text-xl font-bold mb-4">{COLOR_PALETTE_GENERATOR.TITLES.CONTENT_CARDS}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded border" style={{ borderColor: foregroundColor + '30' }}>
                      <h4 className="font-semibold mb-2">{COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.FEATURED_ARTICLE}</h4>
                      <p className="text-sm opacity-75 mb-3">{COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.CARD_DESCRIPTION}</p>
                        <a href="#" className="text-sm underline hover:opacity-80">{COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.READ_MORE}</a>
                    </div>
                    <div className="p-4 rounded border" style={{ borderColor: foregroundColor + '30' }}>
                      <h4 className="font-semibold mb-2">{COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.NOTIFICATION}</h4>
                        <p className="text-sm opacity-75 mb-3">{COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.IMPORTANT_INFO}</p>
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
                  <h3 className="text-xl font-bold mb-4">{COLOR_PALETTE_GENERATOR.TITLES.TEXT_CONTENT}</h3>
                  <div className="space-y-4">
                    <p className="text-base leading-relaxed">
                      {COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.PARAGRAPH_EXAMPLE}
                    </p>
                    <p className="text-sm opacity-75">
                      {COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.SECONDARY_TEXT}
                    </p>
                    <blockquote className="border-l-4 pl-4" style={{ borderColor: foregroundColor }}>
                      <p className="italic">{COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.QUOTE}</p>
                    </blockquote>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.LIST_ITEMS[0]}</li>
                      <li>{COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.LIST_ITEMS[1]}</li>
                      <li>{COLOR_PALETTE_GENERATOR.SAMPLE_CONTENT.LIST_ITEMS[2]}</li>
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
