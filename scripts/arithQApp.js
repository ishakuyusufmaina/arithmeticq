class App {
    constructor(){
this.root = document.createElement("div");
        this.root.id = "app";
this.level = 0;
this.user = null;
this.question = "";
this.ans="";
        
this.promptLevelChoice();
        this.state="";
    }
    
    resume(level, user, question, ans){
        
    }
    
promptLevelChoice (){
    this.levelInput = new LevelInput(DIFFICULTY);
    this.levelInput.render(this.root);
    this.levelInput.playPick = ()=>{picksound.play()};
    this.levelInput.onInput((level)=>{
        this.level = level
        this.startQuiz();
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
    this.questComp = new QuestionComponent(this.question)
    this.keyboard = new Keyboard();
    this.questComp.render(this.root);
    this.keyboard.appendTo(this.root)
    //keyboard.disable();
    this.keyboard.setOnInput((keybtn)=>{
        let key = keybtn.textContent;
        //to avoid forcing the sys perform subtraction
        if (key=="-" & this.ans.length>0){return}
        if (this.ans.search(/[.]/gi) != -1 & key==".") {
            return
        }
        
        else if ((this.ans[this.ans.length-1]=='.' || this.ans[this.ans.length-1]=='-') & key=="-"){
            return
        }
        switch (key) {
            
            case "Enter":
            this.keyboard.setDisabled(true);
                this.enterAnswer();
                this.ans = "";
                //this.promptConti();
                break;
            
            case "Del": 
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
    this.state = "QuestAdmin";
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
    let contInput = new ContinueInput(CONTINUETY_PROMPT);
    let microf = document.getElementById("microfeedback");
    contInput.appendTo(microf);
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
    let feedbackView = new FeedbackView(feedback)
    feedbackView.render(this.root);
    this.state = "EndOfSession";
}


giveSummary(){
    let summary = new Summary(this.user, this.level)
    let summaryView = new SummaryView(summary)
    summaryView.appendTo(this.root);
}




retakePrompt(){
    this.retakingInp = new RetakeInput();
    this.retakingInp.appendTo(this.root);
    this.retakingInp.onInput((isRetaking)=>{
        if (isRetaking){
            this.promptLevelChoice();
        }
        else {
            //I don't know
        }
    })
}
    
}
let app = new App();
//app = JSON.stringify(app);
//app = JSON.parse(app);
document.getElementById("root").appendChild(app.root);
