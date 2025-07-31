import { useState } from 'react';
import { ColorPaletteGenerator } from '@/components/features/color-palette';
import { Toaster } from '@/components/ui/sonner';
import { APP } from '@/constants';
import './App.css';

function App() {
  const [selectedPalette, setSelectedPalette] = useState({ foreground: '#000000', background: '#ffffff' });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header con navegación */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div>
            <div className="flex justify-between items-end">
              <h1 className="heading-2">{APP.HEADER.TITLE}</h1>
              <p className="body-small text-muted-foreground">{APP.HEADER.SUBTITLE}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div>
          <div className="flex flex-col justify-center items-center mb-6">
            <h2 className="heading-3 mb-2">{APP.MAIN.TITLE}</h2>
            <p className="body-normal text-muted-foreground">{APP.MAIN.DESCRIPTION}</p>
          </div>
          <ColorPaletteGenerator onPaletteChange={setSelectedPalette} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="body-small text-muted-foreground">{APP.FOOTER.DESCRIPTION}</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

export default App;
