export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 600;
export const ROUND_SECONDS = 45;
export const TARGET_SCORE = 12;
export const MAX_HITS = 3;
export const PLAYER_SPEED = 520;

const PLAYER_RADIUS = 23;
const MAX_STEP_SECONDS = 0.05;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createGameState() {
  return {
    screen: 'title',
    elapsed: 0,
    timeLeft: ROUND_SECONDS,
    score: 0,
    hits: 0,
    spawnIn: 0.65,
    nextEntityId: 1,
    drops: [],
    particles: [],
    player: {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT - 78,
      radius: PLAYER_RADIUS,
      invulnerable: 0,
    },
  };
}

export function startGame(state) {
  Object.assign(state, createGameState(), { screen: 'playing' });
}

export function togglePause(state) {
  if (state.screen === 'playing') {
    state.screen = 'paused';
    return true;
  }
  if (state.screen === 'paused') {
    state.screen = 'playing';
    return true;
  }
  return false;
}

function makeDrop(state, random) {
  const dangerChance = Math.min(0.4, 0.22 + state.elapsed * 0.003);
  const kind = random() < dangerChance ? 'ink' : 'spark';
  const radius = kind === 'ink' ? 15 + random() * 4 : 10 + random() * 3;

  return {
    id: state.nextEntityId++,
    kind,
    x: 42 + random() * (WORLD_WIDTH - 84),
    y: -radius - 8,
    radius,
    speed: (kind === 'ink' ? 190 : 155) + random() * 75 + state.elapsed * 2.2,
    drift: (random() - 0.5) * 32,
    phase: random() * Math.PI * 2,
  };
}

function addBurst(state, x, y, kind, random) {
  const count = kind === 'spark' ? 11 : 8;
  const color = kind === 'spark' ? 'mint' : 'violet';

  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count + (random() - 0.5) * 0.5;
    const speed = 45 + random() * 110;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.28 + random() * 0.34,
      maxLife: 0.62,
      radius: 1.5 + random() * 2.3,
      color,
    });
  }
}

function updateParticles(state, dt) {
  for (let index = state.particles.length - 1; index >= 0; index -= 1) {
    const particle = state.particles[index];
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 1 - Math.min(1, dt * 2.4);
    particle.vy *= 1 - Math.min(1, dt * 2.4);

    if (particle.life <= 0) state.particles.splice(index, 1);
  }
}

export function updateGame(state, input, deltaSeconds, random = Math.random) {
  if (state.screen !== 'playing') return;

  const dt = clamp(deltaSeconds, 0, MAX_STEP_SECONDS);
  if (dt === 0) return;

  state.elapsed += dt;
  state.timeLeft = Math.max(0, ROUND_SECONDS - state.elapsed);
  state.player.invulnerable = Math.max(0, state.player.invulnerable - dt);

  const direction = Number(Boolean(input.right)) - Number(Boolean(input.left));
  if (direction !== 0) {
    state.player.x += direction * PLAYER_SPEED * dt;
  } else if (Number.isFinite(input.pointerX)) {
    const pointerX = clamp(input.pointerX, 0, WORLD_WIDTH);
    const follow = Math.min(1, dt * 13);
    state.player.x += (pointerX - state.player.x) * follow;
  }
  state.player.x = clamp(state.player.x, 34, WORLD_WIDTH - 34);

  state.spawnIn -= dt;
  if (state.spawnIn <= 0) {
    state.drops.push(makeDrop(state, random));
    const interval = Math.max(0.39, 0.92 - state.elapsed * 0.008);
    state.spawnIn += interval;
  }

  for (let index = state.drops.length - 1; index >= 0; index -= 1) {
    const drop = state.drops[index];
    drop.y += drop.speed * dt;
    drop.x += Math.sin(state.elapsed * 2.1 + drop.phase) * drop.drift * dt;

    if (drop.y > WORLD_HEIGHT + drop.radius + 18) {
      state.drops.splice(index, 1);
      continue;
    }

    const dx = drop.x - state.player.x;
    const dy = drop.y - state.player.y;
    const collisionDistance = drop.radius + state.player.radius * 0.76;
    if (dx * dx + dy * dy > collisionDistance * collisionDistance) continue;

    if (drop.kind === 'spark') {
      state.score = Math.min(TARGET_SCORE, state.score + 1);
      addBurst(state, drop.x, drop.y, 'spark', random);
      if (state.score >= TARGET_SCORE) state.screen = 'won';
    } else {
      if (state.player.invulnerable <= 0) {
        state.hits += 1;
        state.player.invulnerable = 0.82;
        addBurst(state, drop.x, drop.y, 'ink', random);
        if (state.hits >= MAX_HITS) state.screen = 'lost';
      }
    }
    state.drops.splice(index, 1);

    if (state.screen !== 'playing') break;
  }

  updateParticles(state, dt);
  if (state.screen === 'playing' && state.timeLeft <= 0) state.screen = 'lost';
}
