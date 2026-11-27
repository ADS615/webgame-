import { WORLD_WIDTH } from './model.js';

const LEFT_KEYS = new Set(['ArrowLeft', 'KeyA']);
const RIGHT_KEYS = new Set(['ArrowRight', 'KeyD']);
const GAME_KEYS = new Set([...LEFT_KEYS, ...RIGHT_KEYS]);

export class InputController {
  #canvas;
  #keys = new Set();
  #pointerX = null;
  #pointerDown = false;
  #onPause;

  constructor(canvas, onPause) {
    this.#canvas = canvas;
    this.#onPause = onPause;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerEnd = this.onPointerEnd.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerEnd);
    canvas.addEventListener('pointercancel', this.onPointerEnd);
    canvas.addEventListener('pointerleave', this.onPointerLeave);
  }

  onKeyDown(event) {
    if (event.code === 'Escape') {
      const stage = this.#canvas.closest('.stage-frame');
      const focusIsInGame = this.#canvas === document.activeElement || stage?.contains(document.activeElement);
      if (focusIsInGame) {
        event.preventDefault();
        this.#onPause();
      }
      return;
    }

    if (this.#canvas !== document.activeElement || !GAME_KEYS.has(event.code)) return;
    event.preventDefault();
    this.#keys.add(event.code);
  }

  onKeyUp(event) {
    this.#keys.delete(event.code);
  }

  onBlur() {
    this.#keys.clear();
    this.#pointerX = null;
    this.#pointerDown = false;
  }

  getPointerX(event) {
    const rect = this.#canvas.getBoundingClientRect();
    if (rect.width <= 0) return null;
    const ratio = (event.clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(WORLD_WIDTH, ratio * WORLD_WIDTH));
  }

  onPointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.#pointerDown = true;
    this.#pointerX = this.getPointerX(event);
    this.#canvas.focus({ preventScroll: true });
    if (this.#canvas.setPointerCapture) this.#canvas.setPointerCapture(event.pointerId);
  }

  onPointerMove(event) {
    if (event.pointerType === 'mouse' || this.#pointerDown) {
      this.#pointerX = this.getPointerX(event);
    }
  }

  onPointerEnd() {
    this.#pointerDown = false;
  }

  onPointerLeave(event) {
    if (event.pointerType === 'mouse' && !this.#pointerDown) this.#pointerX = null;
  }

  snapshot() {
    return {
      left: this.#keys.has('ArrowLeft') || this.#keys.has('KeyA'),
      right: this.#keys.has('ArrowRight') || this.#keys.has('KeyD'),
      pointerX: this.#pointerX,
    };
  }

  reset() {
    this.#keys.clear();
    this.#pointerX = null;
    this.#pointerDown = false;
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    this.#canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.#canvas.removeEventListener('pointermove', this.onPointerMove);
    this.#canvas.removeEventListener('pointerup', this.onPointerEnd);
    this.#canvas.removeEventListener('pointercancel', this.onPointerEnd);
    this.#canvas.removeEventListener('pointerleave', this.onPointerLeave);
    this.onBlur();
  }
}
