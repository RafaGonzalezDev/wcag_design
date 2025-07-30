import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, AlertTriangle, XCircle, Eye, Palette, Settings } from 'lucide-react';
import { checkWCAGCompliance, isValidHexColor } from '@/lib/wcag-utils';
import type { ColorInput } from '@/types/wcag';

interface ColorTesterProps {
  selectedPalette?: ColorInput;
}

export function ColorTester({ selectedPalette }: ColorTesterProps) {
  const [foreground, setForeground] = useState(selectedPalette?.foreground || '#000000');
  const [background, setBackground] = useState(selectedPalette?.background || '#ffffff');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [simulateColorBlindness, setSimulateColorBlindness] = useState(false);

  React.useEffect(() => {
    if (selectedPalette) {
      setForeground(selectedPalette.foreground);
      setBackground(selectedPalette.background);
    }
  }, [selectedPalette]);

  const wcagResult = isValidHexColor(foreground) && isValidHexColor(background) 
    ? checkWCAGCompliance(foreground, background)
    : null;

  const testStyle = {
    backgroundColor: isValidHexColor(background) ? background : '#ffffff',
    color: isValidHexColor(foreground) ? foreground : '#000000',
  };

  const getComplianceIcon = () => {
    if (!wcagResult) return <XCircle className="w-4 h-4" />;
    if (wcagResult.level === 'AAA') return <CheckCircle2 className="w-4 h-4" />;
    if (wcagResult.level === 'AA') return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const getComplianceProgress = () => {
    if (!wcagResult) return 0;
    const ratio = wcagResult.contrastRatio;
    if (ratio >= 7) return 100;
    if (ratio >= 4.5) return 75;
    if (ratio >= 3) return 50;
    return 25;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Controles principales */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Analizador de Contraste WCAG
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Paleta seleccionada */}
          {selectedPalette && (
            <Alert>
              <Palette className="w-4 h-4" />
              <AlertTitle>Paleta Seleccionada</AlertTitle>
              <AlertDescription>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border" 
                      style={{ backgroundColor: selectedPalette.foreground }}
                    />
                    <code className="text-xs bg-muted px-1 rounded">{selectedPalette.foreground}</code>
                    <span className="text-xs text-muted-foreground">Texto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border" 
                      style={{ backgroundColor: selectedPalette.background }}
                    />
                    <code className="text-xs bg-muted px-1 rounded">{selectedPalette.background}</code>
                    <span className="text-xs text-muted-foreground">Fondo</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Controles de color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fg-color" className="flex items-center gap-2">
                <span>Color de Texto</span>
                <Badge variant="outline" className="text-xs">Primer plano</Badge>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="fg-color"
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bg-color" className="flex items-center gap-2">
                <span>Color de Fondo</span>
                <Badge variant="outline" className="text-xs">Segundo plano</Badge>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Configuraciones avanzadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="advanced-settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuraciones Avanzadas
              </Label>
              <Switch 
                id="advanced-settings"
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
            </div>
            
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="colorblind-sim" className="text-sm">
                    Simular Daltonismo
                  </Label>
                  <Switch 
                    id="colorblind-sim"
                    checked={simulateColorBlindness}
                    onCheckedChange={setSimulateColorBlindness}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Resultado WCAG mejorado */}
          {wcagResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getComplianceIcon()}
                  <div>
                    <div className="font-medium">Ratio de Contraste</div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-mono text-lg">{wcagResult.contrastRatio.toFixed(2)}:1</span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={wcagResult.level === 'AAA' ? 'default' : wcagResult.level === 'AA' ? 'secondary' : 'destructive'}
                  className="text-sm"
                >
                  WCAG {wcagResult.level}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Cumplimiento de Accesibilidad</span>
                  <span>{getComplianceProgress()}%</span>
                </div>
                <Progress value={getComplianceProgress()} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className={`p-2 rounded border text-center ${
                  wcagResult.contrastRatio >= 3 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="font-medium">AA Grande</div>
                  <div className="text-muted-foreground">≥ 3:1</div>
                  <div className={wcagResult.contrastRatio >= 3 ? 'text-green-600' : 'text-red-600'}>
                    {wcagResult.contrastRatio >= 3 ? '✓ Cumple' : '✗ No cumple'}
                  </div>
                </div>
                <div className={`p-2 rounded border text-center ${
                  wcagResult.contrastRatio >= 4.5 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="font-medium">AA Normal</div>
                  <div className="text-muted-foreground">≥ 4.5:1</div>
                  <div className={wcagResult.contrastRatio >= 4.5 ? 'text-green-600' : 'text-red-600'}>
                    {wcagResult.contrastRatio >= 4.5 ? '✓ Cumple' : '✗ No cumple'}
                  </div>
                </div>
                <div className={`p-2 rounded border text-center ${
                  wcagResult.contrastRatio >= 7 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="font-medium">AAA</div>
                  <div className="text-muted-foreground">≥ 7:1</div>
                  <div className={wcagResult.contrastRatio >= 7 ? 'text-green-600' : 'text-red-600'}>
                    {wcagResult.contrastRatio >= 7 ? '✓ Cumple' : '✗ No cumple'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vista previa mejorada */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Simulación de Interfaz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="forms">Formularios</TabsTrigger>
              <TabsTrigger value="navigation">Navegación</TabsTrigger>
              <TabsTrigger value="content">Contenido</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6 mt-6">
              {/* Dashboard de aplicación WCAG */}
              <div
                className="p-6 rounded-lg border-2"
                style={testStyle}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Panel de Accesibilidad</h2>
                  <Badge 
                    style={{
                      backgroundColor: testStyle.color,
                      color: testStyle.backgroundColor
                    }}
                  >
                    {wcagResult?.level || 'Sin evaluar'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded border" style={{ borderColor: testStyle.color + '30' }}>
                    <h3 className="font-semibold mb-2">Tests Realizados</h3>
                    <div className="text-3xl font-bold mb-1">247</div>
                    <p className="text-sm opacity-75">Evaluaciones completadas</p>
                  </div>
                  <div className="p-4 rounded border" style={{ borderColor: testStyle.color + '30' }}>
                    <h3 className="font-semibold mb-2">Cumplimiento</h3>
                    <div className="text-3xl font-bold mb-1">{getComplianceProgress()}%</div>
                    <p className="text-sm opacity-75">Nivel de accesibilidad</p>
                  </div>
                  <div className="p-4 rounded border" style={{ borderColor: testStyle.color + '30' }}>
                    <h3 className="font-semibold mb-2">Contraste</h3>
                    <div className="text-3xl font-bold mb-1">{wcagResult?.contrastRatio.toFixed(1) || '0.0'}</div>
                    <p className="text-sm opacity-75">Ratio actual</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    style={{
                      backgroundColor: testStyle.color,
                      color: testStyle.backgroundColor
                    }}
                  >
                    Ejecutar Análisis
                  </Button>
                  <Button 
                    variant="outline"
                    style={{
                      borderColor: testStyle.color,
                      color: testStyle.color
                    }}
                  >
                    Exportar Reporte
                  </Button>
                  <Button 
                    variant="outline"
                    style={{
                      borderColor: testStyle.color,
                      color: testStyle.color
                    }}
                  >
                    Ver Historial
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="forms" className="space-y-6 mt-6">
              {/* Formulario de configuración WCAG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card style={testStyle}>
                  <CardHeader>
                    <CardTitle>Configuración de Pruebas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="test-url" style={{ color: testStyle.color }}>
                        URL a Evaluar
                      </Label>
                      <Input
                        id="test-url"
                        placeholder="https://ejemplo.com"
                        style={{
                          backgroundColor: testStyle.backgroundColor,
                          color: testStyle.color,
                          borderColor: testStyle.color + '40'
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-level" style={{ color: testStyle.color }}>
                        Nivel de Cumplimiento
                      </Label>
                      <Input
                        id="test-level"
                        placeholder="AA / AAA"
                        style={{
                          backgroundColor: testStyle.backgroundColor,
                          color: testStyle.color,
                          borderColor: testStyle.color + '40'
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-test" style={{ color: testStyle.color }}>
                        Análisis Automático
                      </Label>
                      <Switch id="auto-test" />
                    </div>
                    <Button 
                      className="w-full"
                      style={{
                        backgroundColor: testStyle.color,
                        color: testStyle.backgroundColor
                      }}
                    >
                      Iniciar Evaluación
                    </Button>
                  </CardContent>
                </Card>
                
                <Card style={testStyle}>
                  <CardHeader>
                    <CardTitle>Resultados Recientes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between p-3 rounded border" style={{ borderColor: testStyle.color + '20' }}>
                        <div>
                          <div className="font-medium">Evaluación #{item}</div>
                          <div className="text-sm opacity-75">hace {item} hora{item > 1 ? 's' : ''}</div>
                        </div>
                        <Badge 
                          variant={item === 1 ? 'default' : item === 2 ? 'secondary' : 'destructive'}
                          style={{
                            backgroundColor: item === 1 ? testStyle.color : undefined,
                            color: item === 1 ? testStyle.backgroundColor : undefined
                          }}
                        >
                          {item === 1 ? 'AAA' : item === 2 ? 'AA' : 'Fallo'}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="navigation" className="space-y-6 mt-6">
              {/* Navegación y menús */}
              <div
                className="p-6 rounded-lg border-2"
                style={testStyle}
              >
                <nav className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold">WCAG Analyzer</h2>
                    <div className="hidden md:flex items-center gap-4">
                      <a href="#" className="hover:opacity-75 transition-opacity">Inicio</a>
                      <a href="#" className="hover:opacity-75 transition-opacity">Evaluaciones</a>
                      <a href="#" className="hover:opacity-75 transition-opacity">Reportes</a>
                      <a href="#" className="hover:opacity-75 transition-opacity">Configuración</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      style={{
                        backgroundColor: testStyle.color,
                        color: testStyle.backgroundColor
                      }}
                    >
                      Pro
                    </Badge>
                    <Button 
                      size="sm"
                      style={{
                        backgroundColor: testStyle.color,
                        color: testStyle.backgroundColor
                      }}
                    >
                      Mi Cuenta
                    </Button>
                  </div>
                </nav>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['Contraste', 'Navegación', 'Formularios', 'Multimedia'].map((category) => (
                    <div key={category} className="p-4 rounded border hover:opacity-75 transition-opacity cursor-pointer" style={{ borderColor: testStyle.color + '30' }}>
                      <h3 className="font-semibold mb-2">{category}</h3>
                      <p className="text-sm opacity-75">Evaluar {category.toLowerCase()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6 mt-6">
              {/* Contenido y artículos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card style={testStyle}>
                  <CardHeader>
                    <CardTitle>Guía de Accesibilidad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">
                      Las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 
                      proporcionan un estándar internacional para hacer que el contenido 
                      web sea más accesible para personas con discapacidades.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Principios Fundamentales:</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Perceptible</li>
                        <li>• Operable</li>
                        <li>• Comprensible</li>
                        <li>• Robusto</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        variant="outline"
                        style={{
                          borderColor: testStyle.color,
                          color: testStyle.color
                        }}
                      >
                        WCAG 2.1
                      </Badge>
                      <Badge 
                        variant="outline"
                        style={{
                          borderColor: testStyle.color,
                          color: testStyle.color
                        }}
                      >
                        Nivel AA
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card style={testStyle}>
                  <CardHeader>
                    <CardTitle>Herramientas Recomendadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'Analizador de Contraste', desc: 'Verifica ratios de color' },
                      { name: 'Validador de HTML', desc: 'Estructura semántica' },
                      { name: 'Test de Navegación', desc: 'Accesibilidad por teclado' },
                      { name: 'Lector de Pantalla', desc: 'Compatibilidad con AT' }
                    ].map((tool, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded border" style={{ borderColor: testStyle.color + '20' }}>
                        <div>
                          <div className="font-medium text-sm">{tool.name}</div>
                          <div className="text-xs opacity-75">{tool.desc}</div>
                        </div>
                        <Button 
                          size="sm"
                          variant="outline"
                          style={{
                            borderColor: testStyle.color,
                            color: testStyle.color
                          }}
                        >
                          Usar
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

    </div>
  );
}