class LevelInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.container = document.createElement('div');
    this.container.className = 'level-input-wrapper';

    this.caption = document.createElement('div');
    this.caption.innerText = this.getAttribute('caption') || 'Choose your level';
    this.caption.className = 'level-caption';

    this.container.appendChild(this.caption);
    this.shadowRoot.appendChild(this.container);

    this._value = null;
    this._onenter = null;
    this._onchange = null;
    this._selectedLabel = null;

    // Add style only once
    const style = document.createElement('style');
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
        0% { box-shadow: 0 0 10px rgba(74,144,226,0.5); }
        50% { box-shadow: 0 0 20px rgba(74,144,226,0.8); }
        100% { box-shadow: 0 0 10px rgba(74,144,226,0.5); }
      }

      @keyframes radioGlow {
        0% { box-shadow: 0 0 0px rgba(74,144,226,0.5); }
        50% { box-shadow: 0 0 8px rgba(74,144,226,0.8); }
        100% { box-shadow: 0 0 0px rgba(74,144,226,0.5); }
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

      .level-input-wrapper {
        //border: 2px solid #4A90E2;
        padding: clamp(16px, 4vw, 25px);
        border-radius: 16px;
        background: linear-gradient(135deg, #e0f7ff, #d0ebff);
    //background: url('styles/birc.jpg') no-repeat center/cover; /* clock background */

     
        display: flex;
        flex-direction: column;
        gap: 14px;
        font-family: Arial, sans-serif;
        width: 100%;
        max-width: 420px;
        position: relative;
        overflow: hidden;
        margin: auto;
      }

      .level-caption {
        font-size: clamp(1rem, 3vw, 1.3rem);
        font-weight: bold;
        color: #004080;
        margin-bottom: 6px;
        text-align: center;
        line-height: 1.3;
      }

      .level-input-container {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: clamp(10px, 3vw, 14px) clamp(12px, 4vw, 16px);
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.2s, color 0.3s, background 0.3s;
        background: linear-gradient(90deg, #f0f8ff, #e6f0ff);
        position: relative;
        font-size: clamp(0.95rem, 2.7vw, 1rem);
        min-height: 52px;
        width: 100%;
        word-break: break-word;
      }

      .level-input-container:hover {
        transform: scale(1.02);
        background: linear-gradient(90deg, #cde7ff, #b0d4ff);
      }

      .level-input-container.selected {
        background: linear-gradient(-45deg, #4A90E2, #357ABD, #6AA6FF, #4A90E2);
        background-size: 400% 400%;
        color: white;
        font-weight: bold;
        box-shadow: 0 0 20px rgba(0, 120, 220, 0.5);
        transform: scale(1.02);
        animation: gradientPulse 3s ease infinite;
      }

      .level-radio {
        width: 22px;
        height: 22px;
        min-width: 22px;
        accent-color: #4A90E2;
        cursor: pointer;
        border-radius: 50%;
        transition: transform 0.2s, box-shadow 0.3s;
        flex-shrink: 0;
      }

      .level-radio:hover {
        transform: scale(1.15);
        animation: radioGlow 1s ease infinite;
      }

      .level-radio:checked {
        animation: radioGlow 1s ease infinite;
      }

      .enter-btn {
        margin-top: 10px;
        padding: clamp(12px, 3vw, 14px) clamp(18px, 5vw, 25px);
        font-size: clamp(0.95rem, 2.8vw, 1rem);
        background: linear-gradient(90deg, #4A90E2, #357ABD);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.3s;
        width: 100%;
        min-height: 48px;
      }

      .enter-btn:disabled {
        background: #a0c4ff;
        cursor: not-allowed;
        box-shadow: none;
      }

      .enter-btn:hover:enabled {
        transform: scale(1.02);
      }

      .enter-btn.glow {
        animation: buttonGlow 1.5s ease infinite;
      }

      .confetti, .particle {
        position: absolute;
        pointer-events: none;
        border-radius: 50%;
      }

      .confetti {
        animation: particleBurst 1.5s ease forwards;
      }

      .particle {
        width: 6px;
        height: 6px;
        animation: particleBurst 1s ease forwards;
      }

      /* Small screens */
      @media (max-width: 480px) {
        .level-input-wrapper {
          border-radius: 14px;
          gap: 12px;
        }

        .level-input-container {
          gap: 10px;
          min-height: 50px;
        }

        .level-radio {
          width: 20px;
          height: 20px;
          min-width: 20px;
        }
      }

      /* Very small screens */
      @media (max-width: 320px) {
        .level-input-wrapper {
          padding: 14px;
        }

        .level-input-container {
          padding: 10px 12px;
          font-size: 0.9rem;
        }

        .enter-btn {
          font-size: 0.92rem;
        }
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  init(model) {
    this.container.innerHTML = '';
    this.container.appendChild(this.caption);

    // Enter button
    const enterBtn = document.createElement('button');
    enterBtn.innerText = 'Enter';
    enterBtn.className = 'enter-btn';
    enterBtn.disabled = true;
    enterBtn.onclick = () => {
      if (this.onenter) this.onenter(this);
      if (this._selectedLabel) {
        this.showConfetti(this._selectedLabel);
        this.showParticles(this._selectedLabel);
      }
    };

    model.forEach((levelObj, i) => {
      const { level, label } = levelObj;

      const inp = document.createElement('input');
      inp.type = 'radio';
      inp.value = level;
      inp.name = 'level-input';
      inp.id = 'level-input' + i;
      inp.className = 'level-radio';

      const labelElm = document.createElement('label');
      labelElm.className = 'level-input-container';
      labelElm.htmlFor = inp.id;
      labelElm.append(inp, document.createTextNode(label));

      inp.onchange = e => {
        if (e.target.value) {
          const newVal = inp.value;
          if (this.onchange) this.onchange(this._value, newVal);
          this._value = newVal;

          this.shadowRoot.querySelectorAll('.level-input-container')
            .forEach(l => l.classList.remove('selected'));

          labelElm.classList.add('selected');
          this._selectedLabel = labelElm;

          enterBtn.disabled = false;
          enterBtn.classList.add('glow');
        }
      };

      this.container.appendChild(labelElm);
    });

    this.container.appendChild(enterBtn);
    return this;
  }

  showConfetti(labelElm) {
    const rect = labelElm.getBoundingClientRect();
    const colors = ['#FF3C00', '#FFD500', '#00FF7F', '#00CFFF', '#FF00C8'];
    const wrapperRect = this.container.getBoundingClientRect();

    for (let i = 0; i < 25; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.width = Math.random() * 8 + 4 + 'px';
      conf.style.height = conf.style.width;

      const dx = (Math.random() - 0.5) * 220 + 'px';
      const dy = (Math.random() - 1) * 220 + 'px';

      const x = rect.left - wrapperRect.left + Math.random() * rect.width;
      const y = rect.top - wrapperRect.top + Math.random() * rect.height;

      conf.style.left = x + 'px';
      conf.style.top = y + 'px';
      conf.style.setProperty('--dx', dx);
      conf.style.setProperty('--dy', dy);

      this.shadowRoot.appendChild(conf);
      setTimeout(() => conf.remove(), 1800);
    }
  }

  showParticles(labelElm) {
    const rect = labelElm.getBoundingClientRect();
    const wrapperRect = this.container.getBoundingClientRect();

    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const dx = (Math.random() - 0.5) * 200 + 'px';
      const dy = -(Math.random() * 200 + 50) + 'px';

      const x = rect.left - wrapperRect.left + rect.width / 2;
      const y = rect.top - wrapperRect.top + rect.height / 2;

      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);

      this.shadowRoot.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }
  }

  get level() { return this._value; }
  set onenter(callback) { this._onenter = callback; }
  get onenter() { return this._onenter; }
  set onchange(callback) { this._onchange = callback; }
  get onchange() { return this._onchange; }

  static {
    customElements.define('level-input', LevelInput);
  }
}
