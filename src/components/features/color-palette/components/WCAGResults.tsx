import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WCAGResult } from '@/types/wcag';

interface WCAGResultsProps {
  result: WCAGResult;
}

export function WCAGResults({ result }: WCAGResultsProps) {
  const getStatusColor = (level: string) => {
    switch (level) {
      case 'AAA':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'AA':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'FAIL':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'AAA':
        return '✅';
      case 'AA':
        return '✅';
      case 'FAIL':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusText = (level: string) => {
    switch (level) {
      case 'AAA':
        return 'Excelente - Cumple AAA';
      case 'AA':
        return 'Bueno - Cumple AA';
      case 'FAIL':
        return 'No Accesible';
      default:
        return 'Desconocido';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Resultados WCAG</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          {/* Estado Principal */}
          <div className={`p-4 rounded-lg border ${getStatusColor(result.level)}`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-2">
                {getStatusIcon(result.level)}
                {getStatusText(result.level)}
              </span>
              <span className="text-sm font-mono">
                Ratio: {result.contrastRatio}:1
              </span>
            </div>
            
            {result.level === 'FAIL' && (
              <p className="text-sm mt-2">
                Esta combinación no cumple con los estándares mínimos de accesibilidad WCAG.
              </p>
            )}
          </div>

          {/* Detalles de Cumplimiento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Texto Normal</h4>
              <div className="space-y-1 text-xs">
                <div className={`flex justify-between ${result.contrastRatio >= 4.5 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>AA (4.5:1)</span>
                  <span>{result.contrastRatio >= 4.5 ? '✅' : '❌'}</span>
                </div>
                <div className={`flex justify-between ${result.contrastRatio >= 7 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>AAA (7:1)</span>
                  <span>{result.contrastRatio >= 7 ? '✅' : '❌'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Texto Grande</h4>
              <div className="space-y-1 text-xs">
                <div className={`flex justify-between ${result.contrastRatio >= 3 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>AA (3:1)</span>
                  <span>{result.contrastRatio >= 3 ? '✅' : '❌'}</span>
                </div>
                <div className={`flex justify-between ${result.contrastRatio >= 4.5 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>AAA (4.5:1)</span>
                  <span>{result.contrastRatio >= 4.5 ? '✅' : '❌'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <h4 className="font-medium text-sm text-amber-800 mb-2">💡 Recomendaciones</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Información Adicional */}
        <div className="text-xs text-muted-foreground border-t pt-3 mt-auto">
          <p>
            <strong>Nota:</strong> Los estándares WCAG 2.2 requieren un contraste mínimo de 4.5:1 para texto normal 
            y 3:1 para texto grande (nivel AA). Para el nivel AAA, se requiere 7:1 y 4.5:1 respectivamente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}