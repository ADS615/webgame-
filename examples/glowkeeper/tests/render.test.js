import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState, startGame } from '../src/model.js';
import { renderGame } from '../src/render.js';

function createNoopCanvasContext() {
  const gradient = { addColorStop() {} };
  return new Proxy({ canvas: { width: 960, height: 600 } }, {
    get(target, property) {
      if (property in target) return target[property];
      if (property === 'createLinearGradient' || property === 'createRadialGradient') {
        return () => gradient;
      }
      return () => {};
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    },
  });
}

test('rendering reads game state without changing the simulation', () => {
  const state = createGameState();
  startGame(state);
  state.drops.push({
    id: 1,
    kind: 'spark',
    x: 300,
    y: 220,
    radius: 12,
    speed: 170,
    drift: 5,
    phase: 0.25,
  });
  state.particles.push({
    x: 300,
    y: 220,
    vx: 10,
    vy: -4,
    life: 0.2,
    maxLife: 0.5,
    radius: 2,
    color: 'mint',
  });
  const before = structuredClone(state);

  renderGame(createNoopCanvasContext(), state, false);

  assert.deepEqual(state, before);
});
