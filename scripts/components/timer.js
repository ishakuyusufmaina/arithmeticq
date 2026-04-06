class Timer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this._duration = 0;       
    this._remaining = 0;      
    this._interval = null;
    this._running = false;
    this._onend = () => {};
    this._ontick = () => {};

    // wrapper (centered circular/pill)
    this.wrapper = document.createElement("div");
    this.wrapper.className = "timer-wrapper";

    // display
    this.display = document.createElement("div");
    this.display.className = "timer-display";
    this.display.textContent = "0";

    this.wrapper.appendChild(this.display);

    // style
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }

      .timer-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
        border-radius: 50%; /* circular */
        background: url('styles/clock1.jpg') no-repeat center/cover; /* clock background */
       // border: 2px solid #4A90E2;
        box-shadow: 0 6px 18px rgba(74,144,226,0.15);
        text-align: center;
        position: relative;
      }

      .timer-display {
        font-size: clamp(2rem, 8vw, 3rem);
        font-weight: bold;
        color: #ffc763; //0b63c7;
        transition: transform 0.2s, color 0.2s, box-shadow 0.2s;
        border-radius: 50%;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background: rgba(255, 255, 255, 0.3); /* semi-transparent to see clock */
      }

      @keyframes glowPulse {
        0% { box-shadow: 0 0 10px rgba(255,99,71,0.4); transform: scale(1); }
        50% { box-shadow: 0 0 22px rgba(255,99,71,0.7); transform: scale(1.08); }
        100% { box-shadow: 0 0 10px rgba(255,99,71,0.4); transform: scale(1); }
      }

      .timer-display.warning {
        color: #d62828;
        animation: glowPulse 1s ease-in-out infinite;
      }

      @media (max-width: 480px) {
        .timer-wrapper { width: 110px; height: 110px; }
        .timer-display { font-size: 2.2rem; }
      }

      @media (max-width: 320px) {
        .timer-wrapper { width: 80px; height: 80px; }
        .timer-display { font-size: 1.8rem; }
      }
    `;

    this.shadowRoot.append(style, this.wrapper);
  }

  connectedCallback() {
    const attrDuration = this.getAttribute("duration");
    if (attrDuration !== null) {
      this.duration = Number(attrDuration);
    }
    this.updateDisplay();
  }

  disconnectedCallback() {
    this.stop();
  }

  set duration(seconds) {
    seconds = Math.max(0, Number(seconds) || 0);
    this._duration = seconds;
    this._remaining = seconds;
    this.updateDisplay();
  }

  get duration() {
    return this._duration;
  }

  get remaining() {
    return this._remaining;
  }

  get running() {
    return this._running;
  }

  start() {
    if (this._running || this._remaining <= 0) return;

    this._running = true;

    this._interval = setInterval(() => {
      this._remaining--;
      this.updateDisplay();
      this._ontick(this._remaining);

      if (this._remaining <= 0) {
        this._remaining = 0;
        this.updateDisplay();
        this.stop();
        this._onend();
      }
    }, 1000);
  }

  pause() {
    if (!this._running) return;
    clearInterval(this._interval);
    this._interval = null;
    this._running = false;
  }

  stop() {
    clearInterval(this._interval);
    this._interval = null;
    this._running = false;
  }

  reset(seconds = this._duration) {
    this.stop();
    this._duration = Math.max(0, Number(seconds) || 0);
    this._remaining = this._duration;
    this.updateDisplay();
  }

  restart(seconds = this._duration) {
    this.reset(seconds);
    this.start();
  }

  updateDisplay() {
    this.display.textContent = this._remaining;

    if (this._remaining <= 5 && this._remaining > 0) {
      this.display.classList.add("warning");
      tick();
    } else {
      this.display.classList.remove("warning");
    }
  }

  set onend(callback) {
    this._onend = callback || (() => {});
  }

  get onend() {
    return this._onend;
  }

  set ontick(callback) {
    this._ontick = callback || (() => {});
  }

  get ontick() {
    return this._ontick;
  }

  static {
    customElements.define("seconds-timer", Timer);
  }
}


function tick() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'square'; // square wave sounds more like a tick
  oscillator.frequency.value = 1000; // 1000 Hz
  gainNode.gain.value = 0.1; // volume

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.05); // short 50ms tick
}