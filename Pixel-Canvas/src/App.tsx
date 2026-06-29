import { useState, useCallback, useEffect } from 'react';
import { PixelCanvas } from './components/PixelCanvas';
import { Toolbar } from './components/Toolbar';
import { usePixelGrid } from './hooks/usePixelGrid';
import { useCanvasRenderer } from './hooks/useCanvasRenderer';
import { usePainting } from './hooks/usePainting';
import { GRID_WIDTH, GRID_HEIGHT, PIXEL_SIZE, BACKGROUND_COLOR } from './constants';
import type { Tool } from './types';
import './App.css';

const TOOL_SHORTCUTS: Record<string, Tool> = { b: 'brush', e: 'eraser', f: 'fill' };

export default function App() {
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentTool, setCurrentTool] = useState<Tool | null>(null);

  const { getPixel, setPixel, fillBucket, clearGrid } = usePixelGrid({
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    backgroundColor: BACKGROUND_COLOR,
  });

  const { canvasRef, drawPixel, redrawAll } = useCanvasRenderer({
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    pixelSize: PIXEL_SIZE,
    getPixel,
  });

  useEffect(() => {
    redrawAll();
  }, [redrawAll]);

  const handleClear = useCallback(() => {
    clearGrid();
    redrawAll();
  }, [clearGrid, redrawAll]);

  const handleImageFile = useCallback((file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = GRID_WIDTH;
      tempCanvas.height = GRID_HEIGHT;
      const ctx = tempCanvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, GRID_WIDTH, GRID_HEIGHT);

      const { data } = ctx.getImageData(0, 0, GRID_WIDTH, GRID_HEIGHT);

      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          const i = (y * GRID_WIDTH + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          const color = a < 128
            ? BACKGROUND_COLOR
            : `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
          setPixel(x, y, color);
        }
      }

      URL.revokeObjectURL(url);
      redrawAll();
    };

    img.src = url;
  }, [setPixel, redrawAll]);

  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = usePainting({
    canvasRef,
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    currentColor,
    eraserColor: BACKGROUND_COLOR,
    currentTool,
    setPixel,
    drawPixel,
    fillBucket,
    redrawAll,
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const tool = TOOL_SHORTCUTS[e.key.toLowerCase()];
      if (tool) setCurrentTool(tool);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="app">
      <div className="canvas-area">
        <PixelCanvas
          canvasRef={canvasRef}
          currentTool={currentTool}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      <Toolbar
        currentTool={currentTool}
        onToolChange={setCurrentTool}
        onClear={handleClear}
        currentColor={currentColor}
        onColorChange={setCurrentColor}
        onImportFile={handleImageFile}
      />
    </div>
  );
}
