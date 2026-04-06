class Component {
    constructor(){
        
    }
    onInput(calback){
        
    }
    render(root){
       root.innerText ="";
        root.appendChild(this.view())
    }
    appendTo(root){
        root.appendChild(this.view())
    }
    
    view() {
        
    }
}

//*******************************
create = (el)=>{
            return document.createElement(el)
        }

//*******************************
    
function createRadios (labels){
    radios = labels.map((label, i)=>{
        input = create("input");
        labelElm = create("label")
        labelElm.setAttribute("for", "level" + i);
        labelElm.innerText = label
        input.type = "radio"
        input.name = "level"
        input.id="level"+i
        return {label: labelElm, radio: input}
        
    })
    return radios
}

//*****************************


//******************************



class QuestionComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this._questionData = null;
    this._onQuestion = () => {};
    this._animationTimeout = null;

    this.wrapper = document.createElement("div");
    this.wrapper.className = "question-wrapper";

    this.question = document.createElement("p");
    this.question.className = "question";

    this.expression = document.createElement("span");
    this.expression.className = "expression";

    this.value = document.createElement("span");
    this.value.classList.add("answer", "hide");

    this.question.append(this.expression, this.value);
    this.wrapper.append(this.question);
     
     this.expression.innerHTML = `
        <span class="operand">?</span>
        <span class="operator">?</span>
        <span class="operand">?</span>
        <span class="operator">=</span>
      `;
     

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        width: 100%;
        max-width: 420px;
        margin: auto;
        font-family: Arial, sans-serif;
      }

      .question-wrapper {
        border: 2px solid #4A90E2;
        padding: clamp(18px, 4vw, 28px);
        border-radius: 18px;
        background: linear-gradient(135deg, #e0f7ff, #d0ebff);
        background: url('styles/keypad.jpg') no-repeat center/cover; /* clock background */
        width: 100%;
        position: relative;
        box-shadow: 0 12px 28px rgba(74, 144, 226, 0.12);
        text-align: center;
        overflow: hidden;
      }

      .question {
        margin: 0;
        font-size: clamp(1.5rem, 5vw, 2.3rem);
        font-weight: bold;
        color: #004080;
        line-height: 1.4;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .expression {
        display: inline-flex;
        gap: 10px;
        align-items: center;
      }

      .operand {
        color: #1d4e89;
        background: linear-gradient(90deg, #f0f8ff, #e6f0ff);
        padding: 6px 14px;
        border-radius: 12px;
        min-width: 50px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
      }

      .operator {
        color: #0b63c7;
        font-size: 1.1em;
        min-width: 28px;
        display: inline-flex;
        justify-content: center;
        font-weight: 999;
      }

      .answer {
        color: #0f9d58;
        background: linear-gradient(90deg, #dcffe8, #c6f7d7);
        padding: 6px 14px;
        border-radius: 12px;
        min-width: 60px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
        box-shadow: 0 0 14px rgba(15, 157, 88, 0.18);
      }

      .hide {
        opacity: 0;
        transform: scale(0.7);
        visibility: hidden;
      }

      .answer:not(.hide) {
        opacity: 1;
        transform: scale(1);
        visibility: visible;
      }

      @media (max-width: 480px) {
        .question {
          font-size: clamp(1.3rem, 6vw, 1.8rem);
          gap: 8px;
        }

        .operand,
        .answer {
          padding: 5px 12px;
          min-width: 44px;
          border-radius: 10px;
        }
      }

      @media (max-width: 320px) {
        .question {
          font-size: 1.2rem;
        }

        .operand,
        .answer {
          padding: 4px 10px;
          min-width: 40px;
        }
      }
    `;

    this.shadowRoot.append(style, this.wrapper);
  }

  connectedCallback() {
    // Optional: load from attributes if you want later
  }

  disconnectedCallback() {
    clearTimeout(this._animationTimeout);
  }

  setQuestion(question) {
    if (!question) return;

    clearTimeout(this._animationTimeout);

    this._questionData = question;
    this.value.classList.add("hide");
    this.value.textContent = " ";

    let o1kf1 = question.term1;
    let o2kf1 = question.term2;
    let op = question.operator;

    this.animateExp([o1kf1 - 20, o1kf1], op, [o2kf1 - 20, o2kf1]);
  }

  setAnswer(ans) {
    this.value.textContent = ans;
  }

  animateExp(o1kf, op, o2kf) {
    let o1kf0 = o1kf[0];
    let o1kf1 = o1kf[1];
    let o2kf0 = o2kf[0];
    let o2kf1 = o2kf[1];

    if (o1kf1 > o1kf0) {
      this.expression.innerHTML = `
        <span class="operand">${o1kf0}</span>
        <span class="operator">?</span>
        <span class="operand">?</span>
        <span class="operator">=</span>
      `;

      this._animationTimeout = setTimeout(() => {
        this.animateExp([o1kf0 + 1, o1kf1], op, o2kf);
      }, 50);

    } else if (o2kf1 >= o2kf0) {
      this.expression.innerHTML = `
        <span class="operand">${o1kf0}</span>
        <span class="operator">${op}</span>
        <span class="operand">${o2kf0}</span>
        <span class="operator">=</span>
      `;

      this._animationTimeout = setTimeout(() => {
        this.animateExp(o1kf, op, [o2kf0 + 1, o2kf1]);
      }, 50);

    } else {
      this.value.classList.remove("hide");
      this._onQuestion();
    }
     this.value.textContent = " ";
  }

  replay() {
    if (this._questionData) {
      this.setQuestion(this._questionData);
    }
  }

  set onQuestion(callback) {
    this._onQuestion = callback || (() => {});
  }

  get onQuestion() {
    return this._onQuestion;
  }

  static {
    customElements.define("question-component", QuestionComponent);
  }
}

//***********************

/*class RetakeInput extends Component {
    constructor(){
        super();
        this.retakeBtn = create("button")
        this.retakeBtn.innerHTML = "Retake";
        this.exitBtn = create("button")
        this.exitBtn.innerHTML  = "Exit";
        this.prompt = create("ul");
        this.prompt.id = "promptBtns";
        this.prompt.appendChild(this.retakeBtn)
        this.prompt.appendChild(this.exitBtn)
        
     
        
    }
    onInput(callback){
        this.retakeBtn.onclick = ()=> {
            callback(true)
        }
        this.exitBtn.onclick = ()=>{
            callback(false)
        }
    }
    view(){
           return this.prompt;
    }
}*/


class RetakeInput extends HTMLElement {
    static {
        customElements.define("retake-input", this);
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: Arial, sans-serif;
                }

                .actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                button {
                    border: none;
                    outline: none;
                    padding: 0.9rem 1.4rem;
                    border-radius: 14px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 120px;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
                }

                .retake {
                    background: #2563eb;
                    color: white;
                }

                .retake:hover {
                    background: #1d4ed8;
                    transform: translateY(-2px);
                }

                .exit {
                    background: #ef4444;
                    color: white;
                }

                .exit:hover {
                    background: #dc2626;
                    transform: translateY(-2px);
                }

                @media (max-width: 500px) {
                    .actions {
                        flex-direction: column;
                    }

                    button {
                        width: 100%;
                    }
                }
            </style>

            <div class="actions">
                <button class="retake" id="retakeBtn">Retake</button>
                <button class="exit" id="exitBtn">Exit</button>
            </div>
        `;

        this.retakeBtn = this.shadowRoot.getElementById("retakeBtn");
        this.exitBtn = this.shadowRoot.getElementById("exitBtn");

        this.retakeBtn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("choice", {
                detail: true
            }));
        });

        this.exitBtn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("choice", {
                detail: false
            }));
        });
    }

    onInput(callback) {
        this.addEventListener("choice", (e) => callback(e.detail));
    }

    view() {
        return this;
    }
}

//****************************

/*class ContinueInput extends RetakeInput {
    
    constructor(continuePrompt){
        super(continuePrompt)
        this.retakeBtn.innerText = "Continue";
        this.exitBtn.innerText = "Finish"
    }
}*/

class ContinueInput extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    // Overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "overlay";

    // Dialogue container
    this.container = document.createElement("div");
    this.container.className = "dialogue-wrapper";

    // Prompt buttons container
    this.prompt = document.createElement("div");
    this.prompt.className = "prompt-buttons";

    // Retake / Continue button
    this.retakeBtn = document.createElement("button");
    this.retakeBtn.textContent = "Continue";
    this.retakeBtn.className = "dialog-btn retake";

    // Exit / Finish button
    this.exitBtn = document.createElement("button");
    this.exitBtn.textContent = "Finish";
    this.exitBtn.className = "dialog-btn exit";

    // Append buttons
    this.prompt.append(this.retakeBtn, this.exitBtn);
    this.container.appendChild(this.prompt);

    // Append container to overlay
    this.overlay.appendChild(this.container);

    // Styles
    const style = document.createElement("style");
    style.textContent = `
      .overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
      }

      .dialogue-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(240, 248, 255, 0.95);
        border-radius: 16px;
        border: 2px solid #4A90E2;
        padding: 24px 32px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        gap: 16px;
        min-width: 280px;
        max-width: 360px;
        text-align: center;
      }

      .prompt-buttons {
        display: flex;
        justify-content: center;
        gap: 16px;
        width: 100%;
      }

      .dialog-btn {
        flex: 1;
        padding: 10px 18px;
        font-size: clamp(0.95rem, 3vw, 1.1rem);
        font-weight: bold;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.3s;
        color: white;
      }

      .dialog-btn.retake {
        background: linear-gradient(90deg, #4A90E2, #357ABD);
      }

      .dialog-btn.exit {
        background: linear-gradient(90deg, #d62828, #f77f00);
      }

      .dialog-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 12px rgba(74,144,226,0.5);
      }

      @media (max-width: 480px) {
        .dialogue-wrapper {
          padding: 16px 20px;
          gap: 12px;
        }
        .dialog-btn { font-size: 1rem; padding: 8px 12px; }
      }

      @media (max-width: 320px) {
        .dialogue-wrapper {
          min-width: 240px;
          padding: 12px 16px;
        }
        .dialog-btn { font-size: 0.95rem; padding: 6px 10px; }
      }
    `;

    this.shadowRoot.append(style, this.overlay);
  }

  // Public method to set callbacks
  onInput(callback) {
    this.retakeBtn.onclick = () => {
      callback(true);
      this.close();
    };
    this.exitBtn.onclick = () => {
      callback(false);
      this.close();
    };
  }

  // Close modal
  close() {
    this.remove();
  }
}

customElements.define("continue-input", ContinueInput);

//*****************************



class FeedbackView extends HTMLElement {
    static {
        customElements.define("feedback-view", this);
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: absolute;
                    inset: 0;
                    z-index: 9999;
                    display: none;
                    background: rgba(0, 0, 0, 0.35);
                    justify-content: center;
                    align-items: flex-start;
                    padding-top: 20px;
                    box-sizing: border-box;
                    font-family: Arial, sans-serif;
                }

                .card {
                    width: min(92%, 520px);
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
                    padding: 1rem;
                    border: 1px solid #e5e7eb;
                    animation: slideDown 0.35s ease;
                }

                h2 {
                    margin: 0 0 1rem;
                    text-align: center;
                    font-size: 1.3rem;
                    color: #111827;
                }

                ol {
                    padding: 1rem 1.5rem;
                    margin: 0;
                    background: #f9fafb;
                    border-radius: 14px;
                    border: 1px solid #ddd;
                    max-height: 250px;
                    overflow-y: auto;
                }

                li {
                    margin-bottom: 0.7rem;
                    font-size: 1rem;
                    color: #333;
                    line-height: 1.5;
                }

                button {
                    margin-top: 1rem;
                    width: 100%;
                    padding: 0.85rem;
                    border: none;
                    border-radius: 12px;
                    background: #2563eb;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                button:hover {
                    background: #1d4ed8;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>

            <div class="card">
                <h2>Feedback</h2>
                <ol id="feedbackList"></ol>
                <!--button id="closeBtn">Close</button-->
            </div>
        `;
       this.container = this.shadowRoot.querySelector(".card");
        //this.shadowRoot.getElementById("closeBtn").onclick = () => this.hide();
        
        this.addEventListener("click", (e) => {
           // if (e.target === this) this.hide();
        });
    }

    init(feedback) {
        const feedbacks = feedback.generateAsHTML();
        const list = this.shadowRoot.getElementById("feedbackList");

        list.innerHTML = "";

        feedbacks.forEach((f) => {
            const li = document.createElement("li");
            li.innerHTML = f;
            list.appendChild(li);
        });

        this.style.display = "flex";
        return this;
    }

    hide() {
        this.style.display = "none";
    }
}

//customElements.define("feedback-view", FeedbackView);

class SummaryView extends HTMLElement {
    static {
        customElements.define("summary-view", this);
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: Arial, sans-serif;
                }

                .summary {
                    padding: 1rem 1.2rem;
                    background: linear-gradient(135deg, #eff6ff, #dbeafe);
                    border: 1px solid #bfdbfe;
                    border-radius: 16px;
                    color: #1e3a8a;
                    font-size: 1rem;
                    font-weight: 600;
                    text-align: center;
                    line-height: 1.5;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
                    white-space: pre;
                }
            </style>

            <div class="summary" id="summaryBox"></div>
        `;

        this.summaryBox = this.shadowRoot.getElementById("summaryBox");
    }

    view(summary) {
        this.summaryBox.textContent = summary.toString();
        return this;
    }
}




//************************


