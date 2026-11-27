import { ROUND_SECONDS, WORLD_HEIGHT, WORLD_WIDTH } from './model.js';

const STARS = Array.from({ length: 74 }, (_, index) => ({
  x: (index * 173 + 29) % WORLD_WIDTH,
  y: (index * 131 + 17) % 405,
  radius: 0.7 + ((index * 7) % 10) / 10,
  phase: (index * 37) % 80,
}));

function drawSky(context, state, reducedMotion) {
  const sky = context.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
  sky.addColorStop(0, '#101a2d');
  sky.addColorStop(0.53, '#1b2a3a');
  sky.addColorStop(1, '#243941');
  context.fillStyle = sky;
  context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  const moonGlow = context.createRadialGradient(750, 120, 8, 750, 120, 300);
  moonGlow.addColorStop(0, 'rgba(194, 177, 231, 0.18)');
  moonGlow.addColorStop(1, 'rgba(194, 177, 231, 0)');
  context.fillStyle = moonGlow;
  context.fillRect(430, 0, 530, 430);

  const animationTime = reducedMotion ? 0 : state.elapsed;
  for (const star of STARS) {
    const twinkle = 0.42 + (Math.sin(animationTime * 1.5 + star.phase) + 1) * 0.21;
    context.globalAlpha = twinkle;
    context.fillStyle = star.phase % 3 === 0 ? '#ffe3b1' : '#cde7dd';
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;

  context.fillStyle = 'rgba(120, 162, 151, 0.12)';
  context.beginPath();
  context.moveTo(0, 394);
  context.bezierCurveTo(170, 330, 290, 420, 466, 372);
  context.bezierCurveTo(630, 327, 788, 365, 960, 322);
  context.lineTo(960, 600);
  context.lineTo(0, 600);
  context.closePath();
  context.fill();

  context.fillStyle = 'rgba(7, 24, 31, 0.56)';
  context.beginPath();
  context.moveTo(0, 473);
  context.bezierCurveTo(190, 428, 300, 505, 490, 452);
  context.bezierCurveTo(685, 400, 790, 487, 960, 430);
  context.lineTo(960, 600);
  context.lineTo(0, 600);
  context.closePath();
  context.fill();

  drawMeadowLights(context, animationTime, reducedMotion);
}

function drawMeadowLights(context, time, reducedMotion) {
  for (const x of [86, 178, 772, 875]) {
    const y = 458 + (x % 3) * 11;
    const glow = context.createRadialGradient(x, y - 22, 2, x, y - 22, 42);
    glow.addColorStop(0, 'rgba(255, 212, 144, 0.18)');
    glow.addColorStop(1, 'rgba(255, 212, 144, 0)');
    context.fillStyle = glow;
    context.fillRect(x - 45, y - 67, 90, 90);

    context.fillStyle = 'rgba(216, 203, 162, 0.45)';
    context.fillRect(x - 1, y - 23, 2, 27);
    context.beginPath();
    const glowRadius = reducedMotion ? 3 : 3 + Math.sin(time + x) * 0.5;
    context.arc(x, y - 26, glowRadius, 0, Math.PI * 2);
    context.fillStyle = '#ffdda0';
    context.fill();
  }
}

function drawSpark(context, drop, time, reducedMotion) {
  const pulse = reducedMotion ? 1 : 1 + Math.sin(time * 5 + drop.phase) * 0.08;
  const radius = drop.radius * pulse;
  const glow = context.createRadialGradient(drop.x, drop.y, 1, drop.x, drop.y, radius * 3.6);
  glow.addColorStop(0, 'rgba(174, 255, 205, 0.48)');
  glow.addColorStop(1, 'rgba(174, 255, 205, 0)');
  context.fillStyle = glow;
  context.beginPath();
  context.arc(drop.x, drop.y, radius * 3.6, 0, Math.PI * 2);
  context.fill();

  context.save();
  context.translate(drop.x, drop.y);
  if (!reducedMotion) context.rotate(Math.sin(time * 2 + drop.phase) * 0.16);
  context.fillStyle = '#a9f4c6';
  context.beginPath();
  context.moveTo(0, -radius * 1.4);
  context.quadraticCurveTo(radius * 0.18, -radius * 0.18, radius * 1.05, 0);
  context.quadraticCurveTo(radius * 0.2, radius * 0.2, 0, radius * 1.2);
  context.quadraticCurveTo(-radius * 0.18, radius * 0.2, -radius * 1.05, 0);
  context.quadraticCurveTo(-radius * 0.18, -radius * 0.18, 0, -radius * 1.4);
  context.fill();
  context.fillStyle = 'rgba(255, 250, 208, 0.82)';
  context.beginPath();
  context.arc(-radius * 0.2, -radius * 0.2, radius * 0.25, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawInk(context, drop) {
  const radius = drop.radius;
  const glow = context.createRadialGradient(drop.x, drop.y, radius * 0.4, drop.x, drop.y, radius * 3.4);
  glow.addColorStop(0, 'rgba(177, 132, 220, 0.26)');
  glow.addColorStop(1, 'rgba(177, 132, 220, 0)');
  context.fillStyle = glow;
  context.beginPath();
  context.arc(drop.x, drop.y, radius * 3.4, 0, Math.PI * 2);
  context.fill();

  context.save();
  context.translate(drop.x, drop.y);
  context.fillStyle = '#51446b';
  context.strokeStyle = 'rgba(218, 190, 255, 0.66)';
  context.lineWidth = 1.3;
  context.beginPath();
  context.moveTo(0, -radius * 1.3);
  context.bezierCurveTo(radius * 0.3, -radius * 0.65, radius * 1.08, radius * 0.2, radius * 0.72, radius * 0.82);
  context.quadraticCurveTo(0, radius * 1.5, -radius * 0.72, radius * 0.82);
  context.bezierCurveTo(-radius * 1.08, radius * 0.2, -radius * 0.3, -radius * 0.65, 0, -radius * 1.3);
  context.fill();
  context.stroke();
  context.fillStyle = 'rgba(238, 222, 255, 0.7)';
  context.beginPath();
  context.ellipse(-radius * 0.24, radius * 0.1, radius * 0.15, radius * 0.3, -0.3, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawPlayer(context, state, reducedMotion) {
  const { x, y, radius, invulnerable } = state.player;
  const glow = context.createRadialGradient(x, y, 2, x, y, 66);
  glow.addColorStop(0, 'rgba(175, 245, 200, 0.25)');
  glow.addColorStop(1, 'rgba(175, 245, 200, 0)');
  context.fillStyle = glow;
  context.beginPath();
  context.arc(x, y, 66, 0, Math.PI * 2);
  context.fill();

  const flap = reducedMotion ? 0 : Math.sin(state.elapsed * 13) * 0.12;
  const alpha = invulnerable > 0 ? 0.82 : 1;
  context.save();
  context.globalAlpha = alpha;
  context.translate(x, y);

  context.save();
  context.rotate(-0.36 - flap);
  context.fillStyle = '#b8edcc';
  context.beginPath();
  context.ellipse(-radius * 0.86, -2, radius * 0.58, radius * 0.95, -0.34, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.rotate(0.36 + flap);
  context.fillStyle = '#9ddfbd';
  context.beginPath();
  context.ellipse(radius * 0.86, -2, radius * 0.58, radius * 0.95, 0.34, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.fillStyle = '#f2ddb0';
  context.beginPath();
  context.ellipse(0, 1, radius * 0.27, radius * 0.86, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = 'rgba(245, 223, 179, 0.78)';
  context.lineWidth = 1.3;
  context.beginPath();
  context.moveTo(-3, -radius * 0.52);
  context.quadraticCurveTo(-radius * 0.42, -radius * 0.94, -radius * 0.56, -radius * 1.02);
  context.moveTo(3, -radius * 0.52);
  context.quadraticCurveTo(radius * 0.42, -radius * 0.94, radius * 0.56, -radius * 1.02);
  context.stroke();

  context.fillStyle = '#17242b';
  context.beginPath();
  context.arc(-4, -4, 1.5, 0, Math.PI * 2);
  context.arc(4, -4, 1.5, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawParticles(context, particles) {
  for (const particle of particles) {
    const alpha = Math.max(0, particle.life / particle.maxLife);
    context.globalAlpha = alpha;
    context.fillStyle = particle.color === 'mint' ? '#b9ffd0' : '#d9bfff';
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius * (0.65 + alpha * 0.35), 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
}

function drawDawnLine(context, state) {
  const progress = state.elapsed / ROUND_SECONDS;
  const y = 28 + Math.min(1, progress) * 76;
  const dawn = context.createLinearGradient(0, y - 18, 0, y + 20);
  dawn.addColorStop(0, 'rgba(255, 198, 146, 0)');
  dawn.addColorStop(0.55, 'rgba(255, 198, 146, 0.11)');
  dawn.addColorStop(1, 'rgba(255, 198, 146, 0)');
  context.fillStyle = dawn;
  context.fillRect(0, y - 18, WORLD_WIDTH, 38);
}

export function renderGame(context, state, reducedMotion = false) {
  context.save();
  context.setTransform(
    context.canvas.width / WORLD_WIDTH,
    0,
    0,
    context.canvas.height / WORLD_HEIGHT,
    0,
    0,
  );
  context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  drawSky(context, state, reducedMotion);
  if (state.screen === 'playing' || state.screen === 'paused') drawDawnLine(context, state);

  for (const drop of state.drops) {
    if (drop.kind === 'spark') drawSpark(context, drop, state.elapsed, reducedMotion);
    else drawInk(context, drop);
  }

  if (!reducedMotion) drawParticles(context, state.particles);
  drawPlayer(context, state, reducedMotion);
  context.restore();
}
