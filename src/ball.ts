import { generateRandomInteger } from "./utils";

const colors = [
  "skyblue",
  "yellow",
  "orange",
  "pink",
  "cyan",
  "red",
  "purple",
  "magenta",
  "gray",
  "green",
  "blue",
];

const minVelocity = -0.6;
const maxVelocity = 0.6;
const maxRadius = 40;

const randomVelocity = () => generateRandomInteger(minVelocity, maxVelocity);
const randomRadius = () => generateRandomInteger(0, maxRadius);
const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

export class Ball {
  x: number = 0;
  y: number = 0;
  velocityX: number = randomVelocity();
  velocityY: number = randomVelocity();
  radius: number = randomRadius();
  color: string = randomColor();

  updatePosition() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  handleBoundaryCollision(canvasWidth: number, canvasHeight: number) {
    const isTouchingHorizontalWall =
      this.x - this.radius < 0 || this.x + this.radius > canvasWidth;
    const isTouchingVerticalWall =
      this.y - this.radius < 0 || this.y + this.radius > canvasHeight;

    if (isTouchingHorizontalWall) {
      this.velocityX *= -0.9;
    }

    if (isTouchingVerticalWall) {
      this.velocityY *= -0.9;
    }
  }

  handleCollisionImpact(otherBall: Ball, minDistance: number) {
    const dx = otherBall.x - this.x;
    const dy = otherBall.y - this.y;
    const angle = Math.atan2(dy, dx);
    const targetX = this.x + Math.cos(angle) * minDistance;
    const targetY = this.y + Math.sin(angle) * minDistance;
    const ax = (targetX - otherBall.x) * 0.1;
    const ay = (targetY - otherBall.y) * 0.1;
    this.velocityX -= ax;
    this.velocityY -= ay;
    this.velocityX *= 0.9;
    this.velocityY *= 0.9;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  adjustVelocitiesIfClose(x: number, y: number) {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      this.velocityX -= dx * 0.003;
      this.velocityY -= dy * 0.003;
    }
  }
}
