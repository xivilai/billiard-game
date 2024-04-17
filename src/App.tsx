import React, { useEffect, useRef, useState } from "react";
import {
  Game
} from "./game";
import { BallContextMenu } from "./components/BallContextMenu";
import { Position } from "./types";

let game: Game;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ballMenuPosition, setBallMenuPosition] = useState<Position | null>(
    null
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    game = new Game(canvas);
    game.start();
  }, []);

  const handleCanvasClick = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX: x, offsetY: y } = evt.nativeEvent;
    const ballSelected = game?.selectClickedBall({ x, y });
    if (ballSelected) {
      setBallMenuPosition({ x, y });
    }
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!game) return;

    const { offsetX: x, offsetY: y } = event.nativeEvent;
    game.updateBallVelocities(x, y);
  };

  const handleColorChange = (color: string) => {
    game.setSelectedBallColor(color);
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
