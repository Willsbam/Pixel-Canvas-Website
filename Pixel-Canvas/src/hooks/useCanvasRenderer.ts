import { useRef, useCallback, useEffect } from 'react';

interface Options {
  gridWidth: number;
  gridHeight: number;
  pixelSize: number;
  getPixel: (x: number, y: number) => string;
}

export function useCanvasRenderer({ gridWidth, gridHeight, pixelSize, getPixel }: Options) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d') ?? null;
    if (ctx) ctx.imageSmoothingEnabled = false;
    ctxRef.current = ctx;
  }, []);

  const drawPixel = useCallback((x: number, y: number, color: string): void => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }, [pixelSize]);

  const redrawAll = useCallback((): void => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        ctx.fillStyle = getPixel(x, y);
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  }, [gridWidth, gridHeight, pixelSize, getPixel]);

  return { canvasRef, drawPixel, redrawAll };
}
