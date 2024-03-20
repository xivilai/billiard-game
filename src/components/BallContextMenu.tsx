import { Position } from "../types";

interface Props {
  isOpen: boolean;
  onColorChange: (color: string) => void;
  position: Position | null;
}

function BallContextMenu({ isOpen, position, onColorChange }: Props) {
  const handleColorChange = (color: string) => {
    onColorChange(color);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{ position: "absolute", left: position?.x, top: position?.y }}>
      {["blue", "orange", "yellow", "red"].map((color, i) => (
        <button key={i} onClick={() => handleColorChange(color)}>{color}</button>
      ))}
    </div>
  );
}

export { BallContextMenu };
