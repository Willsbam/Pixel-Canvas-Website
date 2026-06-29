import { useRef, useCallback } from 'react';
import type { RefObject, MouseEvent } from 'react';
import type { Tool } from '../types';

interface Options {
  canvasRef: RefObject<HTMLCanvasElement>;
  gridWidth: number;
  gridHeight: number;
  currentColor: string;
  eraserColor: string;
  currentTool: Tool | null;
  setPixel: (x: number, y: number, color: string) => void;
  drawPixel: (x: number, y: number, color: string) => void;
  fillBucket: (x: number, y: number, color: string) => void;
  redrawAll: () => void;
}

export function usePainting({
  canvasRef,
  gridWidth,
  gridHeight,
  currentColor,
  eraserColor,
  currentTool,
  setPixel,
  drawPixel,
  fillBucket,
  redrawAll,
}: Options) {
  const isPainting = useRef(false);

  // Use rendered rect so coords work regardless of CSS scaling
  const getGridCoords = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) / (rect.width / gridWidth)),
      y: Math.floor((e.clientY - rect.top) / (rect.height / gridHeight)),
    };
  }, [canvasRef, gridWidth, gridHeight]);

  const applyTool = useCallback((x: number, y: number): void => {
    if (currentTool === null) return;
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;

    if (currentTool === 'brush') {
      setPixel(x, y, currentColor);
      drawPixel(x, y, currentColor);
    } else if (currentTool === 'eraser') {
      setPixel(x, y, eraserColor);
      drawPixel(x, y, eraserColor);
    } else if (currentTool === 'fill') {
      fillBucket(x, y, currentColor);
      redrawAll();
    }
  }, [currentTool, currentColor, eraserColor, setPixel, drawPixel, fillBucket, redrawAll, gridWidth, gridHeight]);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLCanvasElement>): void => {
    if (currentTool === null) return;
    e.preventDefault();
    isPainting.current = true;
    const { x, y } = getGridCoords(e);
    applyTool(x, y);
  }, [getGridCoords, applyTool, currentTool]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLCanvasElement>): void => {
    if (!isPainting.current || currentTool === null || currentTool === 'fill') return;
    const { x, y } = getGridCoords(e);
    applyTool(x, y);
  }, [getGridCoords, applyTool, currentTool]);

  const stopPainting = useCallback((): void => {
    isPainting.current = false;
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp: stopPainting,
    handleMouseLeave: stopPainting,
  };
}
