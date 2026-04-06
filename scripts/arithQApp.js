    class App {
    constructor(){
        this.root = document.createElement("div");
        this.root.id = "app";
        this.level = 0;
        this.user = null;
        this.question = "";
        this.ans="";
        this.onQuestionAdmin = ()=>{};
        
        this.state="";
        this.time = 15;
        document.getElementById("root").appendChild(this.root);
        this.promptLevelChoice();

    }
    
    resume(level, user, question, ans){
        
    }
    
promptLevelChoice (){
    this.levelInput = new LevelInput().init(DIFFICULTY);
    this.root.innerHTML = "";
    this.root.append(this.levelInput)
    this.levelInput.scrollIntoView({behavior: "smooth", block: "start"});
    this.root.scrollIntoView({behavior: "smooth", block: "start"});
   // this.root.parentElement.scrollIntoView({behavior: "smooth", block: "start"});

    this.levelInput.onchange = ()=>{picksound.play()};
    this.levelInput.onenter = ((levelInp)=>{
        if (!levelInp.level) return;
        this.level = levelInp.level;
        setTimeout(e=>this.startQuiz(), 500);
    })
    this.state="LevelChoice";
}



startQuiz(){
    startsound.play();
    this.user = new User();
    this.adminQuestion()
}
    
    

adminQuestion (){
    this.question = new Question(this.level)
    this.questComp = new QuestionComponent();
    this.questComp.setQuestion(this.question);
    this.questComp.onQuestion = this.onQuestionAdmin;
    this.keyboard = new Keyboard();
    this.timer = new Timer();
    this.root.innerHTML = "";
    this.root.append(this.timer); //innerHTML = `<p id='count-down'>${this.time}</p>`;
    this.root.append(this.questComp);
    this.root.append(this.keyboard);
    //keyboard.disable();
    this.keyboard.oninput = ((key)=>{
        //let key = keybtn.textContent;
        //to avoid forcing the sys perform subtraction
        if (key=="-" & this.ans.length>0){return}
        if (this.ans.search(/[.]/gi) != -1 & key==".") {
            return
        }
        
        else if ((this.ans[this.ans.length-1]=='.' || this.ans[this.ans.length-1]=='-') & key=="-"){
            return
        }
        switch (key.toLowerCase()) {
            
            case "enter":
            this.keyboard.disabled = true;
                this.enterAnswer();
                this.ans = "";
                //this.promptConti();
                break;
            
            case "del": 
                this.ans = this.ans.slice(0, -1);
                this.questComp.setAnswer(this.ans);
                break;
            
            
            default:
            clicksound.play();
                this.ans +=key
                this.questComp.setAnswer(this.ans)
            
        }
       // ans = answer
        //enterAnswer()
       // promptConti();
            })
    this.state = "QuestionAdmin";
    this.timer.duration = this.time;
    this.timer.start();
    this.timer.onend = e=>this.keyboard.enterKey.click();
   // this.timer.ontick = e=> tick();
} 



enterAnswer (){
    let user = this.user;
    let question = this.question;
    let ans = (this.ans=="-"||this.ans==".")? "":this.ans;
    user.addQA({"question": question, "answer": ans})
    let response;
    if (isCorrect(question, ans)){
        user.addScore(1)
        success.play();
        response = `<span>Correct✓</span>`
    } 
    else {
        response = `Wrong!`
        wrongans.play();
    }
    let questAns = question.toString() + " " + ans;
    this.root.innerHTML += `<div id="microfeedback"><p>${questAns}</p>
    <p>${response}</p>
    <p>Total Score: ${user.getTotalScore()}</p></div>`
    this.promptConti();
    this.state="AnsEntered";
}


promptConti(){
    let contInput = new ContinueInput();
    let microf = document.getElementById("microfeedback");
    contInput.container.prepend(microf);
    this.root.append(contInput);
    contInput.onInput((cont)=>{
        if (cont) {
            this.adminQuestion()
        }
        else {
            this.giveFeedback()
            this.giveSummary()
            this.retakePrompt()
        }
    })
    
}


giveFeedback(){
    let feedback = new Feedback(this.user.getQAs())
    let feedbackView = new FeedbackView();
    this.root.append(feedbackView)
    feedbackView.init(feedback);
    this.feedbackView = feedbackView;
    //feedbackView.render();
    this.state = "EndOfSession";
}


giveSummary(){
    let summary = new Summary(this.user, this.level)
    let summaryView = new SummaryView();
    this.feedbackView.container.append(summaryView.view(summary));
}




retakePrompt(){
    this.retakingInp = new RetakeInput();
    this.feedbackView.container.append(this.retakingInp);
    this.retakingInp.onInput((isRetaking)=>{
        if (isRetaking){
            this.startQuiz();
            //this.promptLevelChoice();
        }
        else {
            //I don't know
            this.promptLevelChoice();
        }
    })
}
    
}


const app = new App();

//a little extension
var timerId;
app.onQuestionAdmin = ()=>{
  
}

function animate() {
  requestAnimationFrame(animate);
  if (app.state === "QuestionAdmin") {
      console.log("frame");
      fitParentToScreen();
      
  }
}

requestAnimationFrame(animate);

//app = JSON.stringify(app);
//app = JSON.parse(app);


