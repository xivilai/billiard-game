import { Position } from "./types";

export interface Ball {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  color: string;
}

const canvasWidth = 480;
const canvasHeight = 360;
const ballMaxRadius = 40;
const minVelocity = -0.6;
const maxVelocity = 0.6;

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

const generateRandomInteger = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const initRandomBall = () => ({
  x: generateRandomInteger(ballMaxRadius, canvasWidth),
  y: generateRandomInteger(ballMaxRadius, canvasHeight),
  velocityX: generateRandomInteger(minVelocity, maxVelocity),
  velocityY: generateRandomInteger(minVelocity, maxVelocity),
  radius: generateRandomInteger(0, ballMaxRadius),
  color: colors[Math.floor(Math.random() * colors.length)],
});

export const balls = Array.from({ length: 10 }, () => initRandomBall());

export let selectedBall: Ball | null = null;

export function update(
  canvasWidth: number,
  canvasHeight: number,
  ctx: CanvasRenderingContext2D
) {
  const rafCallback = () => {
    updateBallPositions(canvasWidth, canvasHeight);
    handleBallCollisions();
    drawBalls(ctx);
    requestAnimationFrame(rafCallback);
  };

  requestAnimationFrame(rafCallback);
}

export function setSelectedBallColor(color: string) {
  if (selectedBall !== null) {
    selectedBall.color = color;
  }
}

export function setSelectedBall(ball: Ball) {
  selectedBall = ball;
}

export function selectClickedBall(clickedBallPosition: Position) {
  const { x, y } = clickedBallPosition;
  const clickedBallIndex = findClickedBallIndex({ x, y }, balls);

  const isBallClicked = clickedBallIndex !== -1;
  if (isBallClicked) {
    setSelectedBall(balls[clickedBallIndex]);
  }
}

export function handleBoundaryCollision(
  ball: Ball,
  canvasWidth: number,
  canvasHeight: number
) {
  const isTouchingHorizontalWall =
    ball.x - ball.radius < 0 || ball.x + ball.radius > canvasWidth;
  const isTouchingVerticalWall =
    ball.y - ball.radius < 0 || ball.y + ball.radius > canvasHeight;

  if (isTouchingHorizontalWall) {
    ball.velocityX *= -0.9;
  }

  if (isTouchingVerticalWall) {
    ball.velocityY *= -0.9;
  }
}

function updateBallPosition(ball: Ball) {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
}

export function updateBallPositions(canvasWidth: number, canvasHeight: number) {
  balls.forEach((ball) => {
    updateBallPosition(ball);
    handleBoundaryCollision(ball, canvasWidth, canvasHeight);
  });
}

function handleCollisionImpact(
  ball: Ball,
  otherBall: Ball,
  minDistance: number
) {
  const dx = otherBall.x - ball.x;
  const dy = otherBall.y - ball.y;
  const angle = Math.atan2(dy, dx);
  const targetX = ball.x + Math.cos(angle) * minDistance;
  const targetY = ball.y + Math.sin(angle) * minDistance;
  const ax = (targetX - otherBall.x) * 0.1;
  const ay = (targetY - otherBall.y) * 0.1;
  ball.velocityX -= ax;
  ball.velocityY -= ay;
  ball.velocityX *= 0.9;
  ball.velocityY *= 0.9;
}

export function handleBallCollisions() {
  balls.forEach((ball, index) => {
    balls.slice(index + 1).forEach((otherBall) => {
      const minDistance = ball.radius + otherBall.radius;
      const distance = calculateDistance(ball, otherBall);
      const isCollision = distance < minDistance;

      if (isCollision) {
        handleCollisionImpact(ball, otherBall, minDistance);
      }
    });
  });
}

export function drawBall(ball: Ball, ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

export function drawBalls(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  balls.forEach((ball) => drawBall(ball, ctx));
}

function calculateDistance(pointA: Position, pointB: Position): number {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function isBallWithinRadius(
  ballPosition: Position,
  offsetPosition: Position,
  radius: number
): boolean {
  const distance = calculateDistance(ballPosition, offsetPosition);
  return distance <= radius;
}

export function findClickedBallIndex(
  offsetPosition: Position,
  balls: Array<Ball>
) {
  return balls.findIndex((ball: Ball) =>
    isBallWithinRadius({ x: ball.x, y: ball.y }, offsetPosition, ball.radius)
  );
}

export function adjustVelocitiesIfClose(ball: Ball, x: number, y: number) {
  const dx = x - ball.x;
  const dy = y - ball.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 100) {
    ball.velocityX -= dx * 0.003;
    ball.velocityY -= dy * 0.003;
  }
}

export function updateBallVelocities(x: number, y: number) {
  balls.forEach((ball) => {
    adjustVelocitiesIfClose(ball, x, y);
  });
}
