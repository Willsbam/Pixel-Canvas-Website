import { PALETTE_COLORS } from '../constants';

interface Props {
  currentColor: string;
  onColorChange: (color: string) => void;
}

export function Palette({ currentColor, onColorChange }: Props) {
  return (
    <div className="palette">
      <div className="palette-swatches">
        {PALETTE_COLORS.map((color) => (
          <button
            key={color}
            className={`swatch${currentColor === color ? ' active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            title={color}
            aria-label={`Select color ${color}`}
            aria-pressed={currentColor === color}
          />
        ))}
      </div>
      <label className="color-picker-label" title="Custom color">
        <span className="color-picker-preview" style={{ backgroundColor: currentColor }} />
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          aria-label="Custom color picker"
        />
      </label>
    </div>
  );
}
