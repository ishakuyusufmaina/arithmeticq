class Keyboard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.wrapper = document.createElement("div");
    this.wrapper.className = "keyboard";

    let keys = "1234567890.-".split("");
    keys = keys.concat(["Enter", "Del"]);

    keys.forEach((e) => {
      let key = document.createElement("button");
      key.textContent = e;
      key.id = "k" + e.toLowerCase().replace(".", "dot").replace("-", "minus");
      key.dataset.value = e;
      key.classList.add("key");

      if (e === "Enter") {
        key.classList.add("enter-key", "glow");
        this.enterKey = key;
      }
      if (e === "Del") key.classList.add("del-key");

      key.addEventListener("click", (ev) => {
        this.createParticles(ev, key);
        this.enter(key.dataset.value);
      });

      this.wrapper.append(key);
    });

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }

      @keyframes gradientPulse {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes buttonGlow {
        0% { box-shadow: 0 0 10px rgba(74,144,226,0.35); }
        50% { box-shadow: 0 0 20px rgba(74,144,226,0.65); }
        100% { box-shadow: 0 0 10px rgba(74,144,226,0.35); }
      }

      @keyframes keyGlow {
        0% { box-shadow: 0 0 0px rgba(74,144,226,0.25); }
        50% { box-shadow: 0 0 12px rgba(74,144,226,0.5); }
        100% { box-shadow: 0 0 0px rgba(74,144,226,0.25); }
      }

      @keyframes particleBurst {
        0% {
          transform: translate(0,0) scale(1) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translate(var(--dx), var(--dy)) scale(0.3) rotate(720deg);
          opacity: 0;
        }
      }

      :host {
        display: block;
        width: 100%;
        max-width: 420px;
        margin: auto;
      }

      .keyboard {
        border: 2px solid #4A90E2;
        padding: clamp(16px, 4vw, 25px);
        border-radius: 16px;
        background: linear-gradient(135deg, #e0f7ff, #d0ebff);
    background: url('styles/keypad.jpg') no-repeat center/cover; /* clock background */

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        width: 100%;
        position: relative;
        overflow: hidden;
        box-shadow: 0 12px 30px rgba(74, 144, 226, 0.12);
      }

      .keyboard::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at top left, rgba(255,255,255,0.45), transparent 35%),
          radial-gradient(circle at bottom right, rgba(74,144,226,0.08), transparent 40%);
        pointer-events: none;
      }

      .key {
        position: relative;
        z-index: 1;
        border: none;
        border-radius: 12px;
        min-height: 58px;
        padding: clamp(12px, 3vw, 14px);
        font-size: clamp(1rem, 2.8vw, 1.1rem);
        font-weight: bold;
        color: #004080;
        background: linear-gradient(90deg, #f0f8ff, #e6f0ff);
        cursor: pointer;
        transition: transform 0.2s, color 0.3s, background 0.3s, box-shadow 0.3s;
        overflow: hidden;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .key:hover {
        transform: scale(1.04);
        background: linear-gradient(90deg, #cde7ff, #b0d4ff);
        animation: keyGlow 1s ease infinite;
      }

      .key:active {
        transform: scale(0.96);
      }

      .key:focus-visible {
        outline: 2px solid #4A90E2;
        outline-offset: 3px;
      }

      .enter-key {
        grid-column: span 2;
        background: linear-gradient(-45deg, #4A90E2, #357ABD, #6AA6FF, #4A90E2);
        background-size: 400% 400%;
        color: white;
        box-shadow: 0 0 20px rgba(0, 120, 220, 0.35);
        animation: gradientPulse 3s ease infinite;
      }

      .enter-key:hover {
        transform: scale(1.03);
      }

      .enter-key.glow {
        animation: gradientPulse 3s ease infinite, buttonGlow 1.5s ease infinite;
      }

      .del-key {
        background: linear-gradient(90deg, #ffd6de, #ffc2cf);
        color: #8b1e3f;
        box-shadow: 0 0 12px rgba(255, 105, 135, 0.15);
      }

      .del-key:hover {
        background: linear-gradient(90deg, #ffbccb, #ffa8bc);
        animation: none;
      }

      .key:disabled {
        background: #dbeeff;
        color: #7c9bb8;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
        animation: none;
        opacity: 0.8;
      }

      .particle {
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(74,144,226,0.8);
        pointer-events: none;
        animation: particleBurst 700ms ease forwards;
        z-index: 2;
      }

      /* Tablet */
      @media (max-width: 768px) {
        .keyboard {
          gap: 12px;
          border-radius: 14px;
        }

        .key {
          min-height: 54px;
          border-radius: 11px;
        }
      }

      /* Small screens */
      @media (max-width: 480px) {
        .keyboard {
          border-radius: 14px;
          gap: 10px;
          padding: 14px;
        }

        .key {
          min-height: 50px;
          font-size: 0.95rem;
        }
      }

      /* Very small screens */
      @media (max-width: 320px) {
        .keyboard {
          padding: 12px;
          gap: 8px;
        }

        .key {
          min-height: 46px;
          font-size: 0.9rem;
          padding: 10px;
        }
      }
    `;

    this.shadowRoot.append(style, this.wrapper);
  }

  createParticles(ev, key) {
    if (this.disabled) return;

    const rect = key.getBoundingClientRect();
    const hostRect = this.wrapper.getBoundingClientRect();

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";

      const x = rect.left - hostRect.left + rect.width / 2;
      const y = rect.top - hostRect.top + rect.height / 2;

      particle.style.left = x + "px";
      particle.style.top = y + "px";
      particle.style.setProperty("--dx", `${(Math.random() - 0.5) * 70}px`);
      particle.style.setProperty("--dy", `${(Math.random() - 0.5) * 70}px`);

      this.wrapper.appendChild(particle);

      particle.addEventListener("animationend", () => particle.remove());
    }
  }

  enter(key) {
    if (this.disabled) return;
    if (this.oninput) this.oninput(key);
  }

  set oninput(callback) {
    this._oninput = callback;
  }

  get oninput() {
    return this._oninput;
  }

  set disabled(bool) {
    this._disabled = bool;
    Array.from(this.shadowRoot.querySelectorAll(".key")).forEach((btn) => {
      btn.disabled = bool;
    });
  }

  get disabled() {
    return this._disabled;
  }

  static {
    customElements.define("key-board", Keyboard);
  }
}

