import type { RefObject, MouseEvent, CSSProperties } from 'react';
import type { Tool } from '../types';
import { GRID_WIDTH, GRID_HEIGHT, PIXEL_SIZE } from '../constants';

const TOOL_CURSOR: Partial<Record<Tool, CSSProperties['cursor']>> = {
  brush: 'crosshair',
  eraser: 'cell',
  fill: 'copy',
};

interface Props {
  canvasRef: RefObject<HTMLCanvasElement>;
  currentTool: Tool | null;
  onMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave: (e: MouseEvent<HTMLCanvasElement>) => void;
}

export function PixelCanvas({ canvasRef, currentTool, onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: Props) {
  const cursor = currentTool ? (TOOL_CURSOR[currentTool] ?? 'crosshair') : 'default';

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={GRID_WIDTH * PIXEL_SIZE}
        height={GRID_HEIGHT * PIXEL_SIZE}
        className="pixel-canvas"
        style={{ cursor }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="grid-overlay" />
    </div>
  );
}
