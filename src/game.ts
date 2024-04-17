import { Position } from "./types";
import { Ball } from "./ball";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  balls: Ball[] = [];
  selectedBall: Ball | null = null;

  constructor(
    canvas: HTMLCanvasElement
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.init();
  }

  init() {
    // setup initial balls
    this.balls = Array.from({ length: 10 }, () => new Ball())

    // setup initial ball positions
    this.balls.forEach((ball) => {
      ball.x = Math.random() * this.canvas.width;
      ball.y = Math.random() * this.canvas.height;
    })
  }

  start() {
    this.update();
  }

  update() {
    const rafCallback = () => {
      this.updateBallPositions();
      this.handleBallCollisions();
      this.drawBalls();
      requestAnimationFrame(rafCallback);
    };

    requestAnimationFrame(rafCallback);
  }

  setSelectedBallColor(color: string) {
    if (this.selectedBall !== null) {
      this.selectedBall.color = color;
    }
  }

  setSelectedBall(ball: Ball) {
    this.selectedBall = ball;
  }

  selectClickedBall(clickedBallPosition: Position) {
    const { x, y } = clickedBallPosition;
    const clickedBallIndex = this.findClickedBallIndex({ x, y });

    const isBallClicked = clickedBallIndex !== -1;
    if (isBallClicked) {
      this.setSelectedBall(this.balls[clickedBallIndex]);
      return true;
    }

    return false;
  }

  updateBallPositions() {
    this.balls.forEach((ball) => {
      ball.updatePosition();
      ball.handleBoundaryCollision(this.canvas.width, this.canvas.height);
    });
  }

  handleBallCollisions() {
    this.balls.forEach((ball, index) => {
      this.balls.slice(index + 1).forEach((otherBall) => {
        const minDistance = ball.radius + otherBall.radius;
        const distance = this.calculateDistance(ball, otherBall);
        const isCollision = distance < minDistance;

        if (isCollision) {
          ball.handleCollisionImpact(otherBall, minDistance);
        }
      });
    });
  }

  drawBalls() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.balls.forEach((ball) => ball.draw(this.ctx));
  }

  calculateDistance(pointA: Position, pointB: Position): number {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  isBallWithinRadius(
    ballPosition: Position,
    offsetPosition: Position,
    radius: number
  ): boolean {
    const distance = this.calculateDistance(ballPosition, offsetPosition);
    return distance <= radius;
  }

  findClickedBallIndex(offsetPosition: Position): number {
    return this.balls.findIndex((ball: Ball) =>
      this.isBallWithinRadius({ x: ball.x, y: ball.y }, offsetPosition, ball.radius)
    );
  }

  updateBallVelocities(x: number, y: number) {
    this.balls.forEach((ball) => {
      ball.adjustVelocitiesIfClose(x, y);
    });
  }
}
