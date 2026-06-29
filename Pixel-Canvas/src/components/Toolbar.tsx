import { useRef, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import type { Tool } from '../types';

interface ToolDef {
  id: Tool;
  label: string;
  title: string;
}

const TOOLS: ToolDef[] = [
  { id: 'brush', label: 'Brush', title: 'Brush (B)' },
  { id: 'eraser', label: 'Eraser', title: 'Eraser (E)' },
  { id: 'fill', label: 'Fill', title: 'Flood Fill (F)' },
];

interface Props {
  currentTool: Tool | null;
  onToolChange: (tool: Tool) => void;
  onClear: () => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  onImportFile: (file: File) => void;
}

export function Toolbar({ currentTool, onToolChange, onClear, currentColor, onColorChange, onImportFile }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [onImportFile]);

  return (
    <div className="toolbar">
      <div className="tool-group">
        {TOOLS.map(({ id, label, title }) => (
          <button
            key={id}
            className={`tool-btn${currentTool === id ? ' active' : ''}`}
            onClick={() => onToolChange(id)}
            title={title}
            aria-pressed={currentTool === id}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="tool-group">
        <button className="tool-btn clear-btn" onClick={onClear} title="Clear canvas">
          Clear
        </button>
        <button
          className="tool-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Import image — scales to grid size"
        >
          Import Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      <div className="toolbar-spacer" />

      <label className="color-picker-label" title="Pick color">
        <span className="color-picker-preview" style={{ backgroundColor: currentColor }} />
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          aria-label="Color picker"
        />
      </label>
    </div>
  );
}
