import React, { useEffect, useRef, useState } from "react";
import {
  selectClickedBall,
  setSelectedBallColor,
  update,
  updateBallVelocities,
} from "./game";
import { BallContextMenu } from "./components/BallContextMenu";
import { Position } from "./types";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ballMenuPosition, setBallMenuPosition] = useState<Position | null>(
    null
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    update(canvas.width, canvas.height, ctx);
  }, []);

  const handleCanvasClick = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX: x, offsetY: y } = evt.nativeEvent;
    selectClickedBall({ x, y });
    setBallMenuPosition({ x, y });
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { offsetX: x, offsetY: y } = event.nativeEvent;
    updateBallVelocities(x, y);
  };

  const handleColorChange = (color: string) => {
    setSelectedBallColor(color);
    setBallMenuPosition(null);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          style={{ border: "2px solid orange" }}
          width={480}
          height={360}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
        />
        <BallContextMenu
          isOpen={ballMenuPosition !== null}
          onColorChange={handleColorChange}
          position={ballMenuPosition}
        />
      </div>
    </div>
  );
}

export default App;
