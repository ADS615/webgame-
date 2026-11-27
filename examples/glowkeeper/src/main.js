import {
  createGameState,
  ROUND_SECONDS,
  startGame,
  TARGET_SCORE,
  togglePause,
  updateGame,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './model.js';
import { InputController } from './input.js';
import { renderGame } from './render.js';

const canvas = document.querySelector('#game-canvas');
const context = canvas.getContext('2d', { alpha: false });
if (!context) throw new Error('Canvas 2D is not available in this browser.');

const ui = {
  scoreNumber: document.querySelector('#score-number'),
  progress: document.querySelector('#score-progress'),
  stageOverlay: document.querySelector('#stage-overlay'),
  time: document.querySelector('#time-value'),
  pips: [...document.querySelectorAll('#hit-pips i')],
  hitDescription: document.querySelector('#hit-description'),
  title: document.querySelector('#title-panel'),
  pause: document.querySelector('#pause-panel'),
  result: document.querySelector('#result-panel'),
  resultEyebrow: document.querySelector('#result-eyebrow'),
  resultHeading: document.querySelector('#result-heading'),
  resultCopy: document.querySelector('#result-copy'),
  announcer: document.querySelector('#game-announcer'),
  startButton: document.querySelector('#start-button'),
  resumeButton: document.querySelector('#resume-button'),
  pausedRestartButton: document.querySelector('#paused-restart-button'),
  replayButton: document.querySelector('#replay-button'),
  pauseButton: document.querySelector('#pause-button'),
  restartButton: document.querySelector('#restart-button'),
};

const state = createGameState();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let input;
let resizeObserver;
let previousFrameMs;
let animationFrameId = 0;
let runtimeMounted = false;
let lastScreen = state.screen;
let lastScore = -1;
let lastTime = -1;
let lastHits = -1;

function focusPlayfield() {
  canvas.focus({ preventScroll: true });
}

function announceScreen() {
  const messages = {
    title: 'Glowkeeper. Catch twelve glow seeds before dawn. Avoid three ink drops.',
    playing: 'The night is underway.',
    paused: 'Game paused. Choose back to the meadow to resume.',
    won: `You kept the glow alive. ${state.score} glow seeds collected.`,
    lost: `The night is over. ${state.score} glow seeds collected. Play another night to try again.`,
  };
  ui.announcer.textContent = messages[state.screen] ?? '';
}

function syncPanels() {
  const isTitle = state.screen === 'title';
  const isPaused = state.screen === 'paused';
  const isResult = state.screen === 'won' || state.screen === 'lost';
  ui.stageOverlay.classList.toggle('is-active', isTitle || isPaused || isResult);
  ui.title.hidden = !isTitle;
  ui.pause.hidden = !isPaused;
  ui.result.hidden = !isResult;
  ui.pauseButton.hidden = state.screen !== 'playing';
  ui.restartButton.hidden = state.screen !== 'playing';
  ui.pauseButton.textContent = 'Pause';

  if (state.screen === 'won') {
    ui.resultEyebrow.textContent = 'NIGHT COMPLETE';
    ui.resultHeading.textContent = 'The glow made it home.';
    ui.resultCopy.textContent = `You gathered all ${TARGET_SCORE} glow seeds with ${Math.max(0, ROUND_SECONDS - Math.ceil(state.elapsed))} seconds to spare.`;
  } else if (state.screen === 'lost') {
    ui.resultEyebrow.textContent = state.timeLeft <= 0 ? 'THE SUN IS UP' : 'THE LANTERN WENT DIM';
    ui.resultHeading.textContent = state.timeLeft <= 0 ? 'Dawn came too soon.' : 'The night got away.';
    ui.resultCopy.textContent = `${state.score} of ${TARGET_SCORE} glow seeds made it home. The meadow will be here tomorrow.`;
  }
}

function syncHud() {
  if (lastScore !== state.score) {
    ui.scoreNumber.textContent = String(state.score).padStart(2, '0');
    ui.progress.value = state.score;
    ui.progress.textContent = `${state.score} of ${TARGET_SCORE} glow seeds`;
    ui.progress.setAttribute('aria-valuetext', `${state.score} of ${TARGET_SCORE} glow seeds`);
    if (state.score > lastScore && lastScore >= 0 && state.screen === 'playing') {
      ui.announcer.textContent = `${state.score} of ${TARGET_SCORE} glow seeds collected.`;
    }
    lastScore = state.score;
  }

  const seconds = Math.max(0, Math.ceil(state.timeLeft));
  if (lastTime !== seconds) {
    ui.time.textContent = `00:${String(seconds).padStart(2, '0')}`;
    lastTime = seconds;
  }

  if (lastHits !== state.hits) {
    for (const [index, pip] of ui.pips.entries()) {
      pip.classList.toggle('is-lost', index < state.hits);
    }
    const remaining = Math.max(0, 3 - state.hits);
    ui.hitDescription.textContent = `${remaining} lantern ${remaining === 1 ? 'hit' : 'hits'} remaining`;
    lastHits = state.hits;
  }
}

function syncUi() {
  if (lastScreen !== state.screen) {
    syncPanels();
    announceScreen();
    lastScreen = state.screen;

    if (!document.hidden) {
      if (state.screen === 'paused') ui.resumeButton.focus({ preventScroll: true });
      else if (state.screen === 'won' || state.screen === 'lost') ui.replayButton.focus({ preventScroll: true });
      else if (state.screen === 'playing') focusPlayfield();
    }
  }
  syncHud();
}

function startRun() {
  startGame(state);
  input?.reset();
  previousFrameMs = undefined;
  syncUi();
  focusPlayfield();
}

function pauseOrResume() {
  if (!togglePause(state)) return;
  previousFrameMs = undefined;
  syncUi();
  if (state.screen === 'playing') focusPlayfield();
}

ui.startButton.addEventListener('click', startRun);
ui.resumeButton.addEventListener('click', pauseOrResume);
ui.pausedRestartButton.addEventListener('click', startRun);
ui.replayButton.addEventListener('click', startRun);
ui.pauseButton.addEventListener('click', pauseOrResume);
ui.restartButton.addEventListener('click', startRun);

document.addEventListener('visibilitychange', () => {
  previousFrameMs = undefined;
  if (document.hidden && state.screen === 'playing') pauseOrResume();
  else if (!document.hidden && state.screen === 'paused') ui.resumeButton.focus({ preventScroll: true });
});

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  context.setTransform(canvas.width / WORLD_WIDTH, 0, 0, canvas.height / WORLD_HEIGHT, 0, 0);
  renderGame(context, state, reducedMotion.matches);
}

function frame(nowMs) {
  if (!runtimeMounted) return;
  const rawDt = previousFrameMs === undefined ? 0 : (nowMs - previousFrameMs) / 1000;
  previousFrameMs = nowMs;
  updateGame(state, input.snapshot(), rawDt);
  syncUi();
  renderGame(context, state, reducedMotion.matches);
  animationFrameId = window.requestAnimationFrame(frame);
}

function mountRuntime() {
  if (runtimeMounted) return;
  runtimeMounted = true;
  input = new InputController(canvas, pauseOrResume);
  resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(canvas);
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  previousFrameMs = undefined;
  animationFrameId = window.requestAnimationFrame(frame);
}

function unmountRuntime() {
  if (!runtimeMounted) return;
  runtimeMounted = false;
  window.cancelAnimationFrame(animationFrameId);
  resizeObserver.disconnect();
  window.removeEventListener('resize', resizeCanvas);
  input.dispose();
  input = undefined;
}

window.addEventListener('pagehide', unmountRuntime);
window.addEventListener('pageshow', mountRuntime);
mountRuntime();
