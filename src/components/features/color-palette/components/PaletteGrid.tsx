import { Button } from '@/components/ui/button';
import { checkWCAGCompliance } from '@/lib/wcag-utils';
import type { ColorInput } from '@/types/wcag';
import { PALETTE_GRID } from '@/constants';

interface PaletteGridProps {
  palettes: ColorInput[];
  onSelectPalette: (palette: ColorInput) => void;
  currentForeground: string;
  currentBackground: string;
}

export function PaletteGrid({ 
  palettes, 
  onSelectPalette, 
  currentForeground, 
  currentBackground 
}: PaletteGridProps) {
  const isCurrentPalette = (palette: ColorInput) => {
    return palette.foreground.toLowerCase() === currentForeground.toLowerCase() && 
           palette.background.toLowerCase() === currentBackground.toLowerCase();
  };

  if (palettes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{PALETTE_GRID.EMPTY_STATE.NO_PALETTES}</p>
        <p className="text-sm mt-2">{PALETTE_GRID.EMPTY_STATE.TRY_DIFFERENT}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {palettes.map((palette, index) => {
        const wcagResult = checkWCAGCompliance(palette.foreground, palette.background);
        const isCurrent = isCurrentPalette(palette);
        
        return (
          <div
            key={index}
            className={`relative group cursor-pointer transition-all duration-200 hover:scale-105 ${
              isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            onClick={() => onSelectPalette(palette)}
          >
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Vista previa de colores */}
              <div 
                className="h-24 flex items-center justify-center relative"
                style={{
                  backgroundColor: palette.background,
                  color: palette.foreground,
                }}
              >
                <div className="text-center">
                  <div className="font-semibold text-sm mb-1">Texto de Ejemplo</div>
                  <div className="text-xs opacity-75">Aa Bb Cc</div>
                </div>
                
                {/* Indicador de nivel WCAG */}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    wcagResult.level === 'AAA' 
                      ? 'bg-green-100 text-green-800' 
                      : wcagResult.level === 'AA'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {wcagResult.level}
                  </span>
                </div>
                
                {/* Indicador de selección actual */}
                {isCurrent && (
                  <div className="absolute top-2 left-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium">
                      {PALETTE_GRID.CURRENT}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Información de la paleta */}
              <div className="p-3 bg-white">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-600">{PALETTE_GRID.LABELS.CONTRAST}</span>
                  <span className="text-xs font-mono text-gray-800">
                    {wcagResult.contrastRatio}:1
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-gray-500 mb-1">{PALETTE_GRID.LABELS.TEXT}</div>
                    <div 
                      className="w-full h-4 rounded border flex items-center justify-center text-[10px] font-mono text-white"
                      style={{ backgroundColor: palette.foreground }}
                    >
                      {palette.foreground.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">{PALETTE_GRID.LABELS.BACKGROUND}</div>
                    <div 
                      className="w-full h-4 rounded border flex items-center justify-center text-[10px] font-mono"
                      style={{ 
                        backgroundColor: palette.background,
                        color: palette.background === '#ffffff' || palette.background === '#FFFFFF' ? '#000' : '#fff'
                      }}
                    >
                      {palette.background.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                {/* Botón de selección */}
                <Button 
                  variant={isCurrent ? "default" : "outline"} 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPalette(palette);
                  }}
                >
                  {isCurrent ? 'Seleccionada' : 'Seleccionar'}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}