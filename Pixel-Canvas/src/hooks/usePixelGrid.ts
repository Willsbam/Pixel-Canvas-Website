import { useRef, useCallback } from 'react';

interface Options {
  gridWidth: number;
  gridHeight: number;
  backgroundColor: string;
}

export function usePixelGrid({ gridWidth, gridHeight, backgroundColor }: Options) {
  const grid = useRef<string[]>(Array(gridWidth * gridHeight).fill(backgroundColor));

  const getPixel = useCallback((x: number, y: number): string => {
    return grid.current[y * gridWidth + x];
  }, [gridWidth]);

  const setPixel = useCallback((x: number, y: number, color: string): void => {
    grid.current[y * gridWidth + x] = color;
  }, [gridWidth]);

  const fillBucket = useCallback((startX: number, startY: number, fillColor: string): void => {
    const target = grid.current[startY * gridWidth + startX];
    if (target === fillColor) return;

    const queue: [number, number][] = [[startX, startY]];
    const visited = new Set<number>();

    while (queue.length > 0) {
      const [x, y] = queue.pop()!;
      const key = y * gridWidth + x;

      if (visited.has(key)) continue;
      if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) continue;
      if (grid.current[key] !== target) continue;

      visited.add(key);
      grid.current[key] = fillColor;

      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }, [gridWidth, gridHeight]);

  const clearGrid = useCallback((): void => {
    grid.current.fill(backgroundColor);
  }, [backgroundColor]);

  return { getPixel, setPixel, fillBucket, clearGrid };
}
