import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_HITS,
  PLAYER_SPEED,
  ROUND_SECONDS,
  startGame,
  createGameState,
  togglePause,
  updateGame,
  WORLD_WIDTH,
} from '../src/model.js';

const idleInput = { left: false, right: false, pointerX: null };
const steadyRandom = () => 0.5;

function playingState() {
  const state = createGameState();
  startGame(state);
  state.spawnIn = 10;
  return state;
}

function touchingDrop(state, kind) {
  return {
    id: 200,
    kind,
    x: state.player.x,
    y: state.player.y,
    radius: kind === 'ink' ? 15 : 11,
    speed: 0,
    drift: 0,
    phase: 0,
  };
}

test('new sessions start from a clean, playable state', () => {
  const state = createGameState();
  startGame(state);
  state.elapsed = 14;
  state.timeLeft = 31;
  state.score = 7;
  state.hits = 2;
  state.player.x = 100;
  state.drops.push({ id: 1 });
  state.particles.push({ id: 2 });

  startGame(state);

  assert.equal(state.screen, 'playing');
  assert.equal(state.elapsed, 0);
  assert.equal(state.score, 0);
  assert.equal(state.hits, 0);
  assert.equal(state.timeLeft, ROUND_SECONDS);
  assert.equal(state.drops.length, 0);
  assert.equal(state.particles.length, 0);
  assert.equal(state.player.x, WORLD_WIDTH / 2);
});

test('keyboard movement is time-based and stays inside the playfield', () => {
  const state = playingState();
  const startX = state.player.x;
  updateGame(state, { ...idleInput, left: true }, 0.05, steadyRandom);
  assert.ok(state.player.x < startX);

  state.player.x = 40;
  updateGame(state, { ...idleInput, left: true }, 0.05, steadyRandom);
  assert.ok(state.player.x >= 34);
});

test('pointer steering is clamped to the world and smoothly moves the player', () => {
  const state = playingState();
  updateGame(state, { ...idleInput, pointerX: WORLD_WIDTH + 500 }, 0.05, steadyRandom);
  assert.ok(state.player.x < WORLD_WIDTH);
  assert.ok(state.player.x > WORLD_WIDTH / 2);
});

test('spawns are repeatable when a test supplies a seeded random source', () => {
  function spawnOne() {
    const state = playingState();
    state.spawnIn = 0.01;
    updateGame(state, idleInput, 0.05, steadyRandom);
    assert.equal(state.drops.length, 1);
    return state.drops[0];
  }

  assert.deepEqual(spawnOne(), spawnOne());
  assert.equal(spawnOne().kind, 'spark');
});

test('catching a glow seed increases score and creates feedback particles', () => {
  const state = playingState();
  state.drops.push(touchingDrop(state, 'spark'));

  updateGame(state, idleInput, 1 / 60, steadyRandom);

  assert.equal(state.score, 1);
  assert.equal(state.drops.length, 0);
  assert.ok(state.particles.length > 0);
});

test('collecting the final seed completes the run', () => {
  const state = playingState();
  state.score = 11;
  state.drops.push(touchingDrop(state, 'spark'));

  updateGame(state, idleInput, 1 / 60, steadyRandom);

  assert.equal(state.score, 12);
  assert.equal(state.screen, 'won');
});

test('an ink drop costs one hit and the final hit ends the run', () => {
  const state = playingState();
  state.hits = MAX_HITS - 1;
  state.drops.push(touchingDrop(state, 'ink'));

  updateGame(state, idleInput, 1 / 60, steadyRandom);

  assert.equal(state.hits, MAX_HITS);
  assert.equal(state.screen, 'lost');
});

test('invulnerability prevents overlapping ink drops from removing several hits at once', () => {
  const state = playingState();
  state.drops.push(touchingDrop(state, 'ink'), { ...touchingDrop(state, 'ink'), id: 201 });

  updateGame(state, idleInput, 1 / 60, steadyRandom);

  assert.equal(state.hits, 1);
  assert.ok(state.player.invulnerable > 0);
});

test('the run ends at dawn if the goal was not reached', () => {
  const state = playingState();
  state.elapsed = ROUND_SECONDS - 0.02;
  state.timeLeft = 0.02;
  state.spawnIn = 10;

  updateGame(state, idleInput, 0.05, steadyRandom);

  assert.equal(state.timeLeft, 0);
  assert.equal(state.screen, 'lost');
});

test('paused sessions do not advance the simulation', () => {
  const state = playingState();
  togglePause(state);
  const before = state.elapsed;

  updateGame(state, { ...idleInput, right: true }, 0.05, steadyRandom);

  assert.equal(state.screen, 'paused');
  assert.equal(state.elapsed, before);
});

test('large frame gaps are clamped instead of teleporting the player', () => {
  const state = playingState();
  const startX = state.player.x;

  updateGame(state, { ...idleInput, right: true }, 10, steadyRandom);

  assert.equal(state.elapsed, 0.05);
  assert.equal(state.player.x, startX + PLAYER_SPEED * 0.05);
});
