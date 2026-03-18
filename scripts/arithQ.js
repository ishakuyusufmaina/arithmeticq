class User {
    
    constructor(){
        this.qAs =[]
        this.totalScore = 0;
        this.continuety = false
    }
    
    setContinuety(con){
        this.continuety = cont
    }
    getContinuety(){
        return this.continuety
    }
    addQA(qa){
        this.qAs.push(qa)
    }
    getQAs(){
        return this.qAs
    }
    addScore(n){
        this.totalScore +=n
    }
    getTotalScore(){
        return this.totalScore
    }
    
}



class Question {
    
    constructor(level){
        this.randint =(level)=>{
            let num = Math.random();
            num = num*level + 1
            return Math.floor(num)
        }
        this.level = level;
        this.term1 = this.randint(level)
        this.term2 = this.randint(level)
        let opSize = OPERATORS.length;
        let opIndex = this.randint(opSize)
        this.operator = OPERATORS[opIndex-1]
        if (this.operator == "/"){
            this.pickDivisible();
        }
        
    }
    evaluate(){
       let o = this.operator
       let t1 = this.term1
       let t2 = this.term2
        switch(o) {
            case "+": return t1 + t2
            case "-": return t1 - t2
            case "×": return t1 * t2
            default: return t1 / t2
            
        }
    }
    
    pickDivisible(){
        let result = this.term1/this.term2;
        if (!Number.isInteger(result)){
            this.term1 = this.randint(this.level);
            this.term2 = this.randint(this.level);
            this.pickDivisible();
        }
    }
    
    toString(){
        return `${this.term1} ${this.operator} ${this.term2} = `
    }
}





class Feedback {
    constructor(qAs, test){
        this.qAs = qAs
        this.test = test
    }
    generate(){
       let feedback = qAs.map((qa, i, qas)=>{
       let    q = qa.question.toString();
        let   a = qa.answer;
            comment = (isCorrect(qa.question, a)) ? "Correct" : "Wrong, correction: " + qa.question.evaluate()
            return q + " " + a + " " + comment;
        })
        
    }
    generateAsHTML(){
       let feedback = this.qAs.map((qa, i, qas)=>{
           let q = qa.question.toString();
           let a = qa.answer;
            let htmlComment = (isCorrect(qa.question, a)) ? "<span>Correct</span>" : "<span>Wrong</span>, <span>correction: " + qa.question.evaluate() + "</span>";
            return "<p><span>"+q+"</span> <span>"+a+"</span>  <span>" + htmlComment+"</span></p>";
        })
        return feedback
        
    }
    
    toString(){
        feedback = ""
        this.qAs.forEach((qa, i, qAs)=>{
         let   q = qa.question;
         let   a = qa.answer;
            feedback += (i+1) + ". " + q.toString() + a + ((this.test(q, a))? "Correct" : "Wrong, Correction: " + q.evaluate()) + "\n"
            
            })
        return feedback
    }
}
    





class Summary {
    constructor(user, level){
        this.user = user
        this.level = level
    }
    
    getQuestion(){
       let qAs = this.user.getQAs()
        return qAs.length;
    }
    getCorrectAns(){
       let crrAns =0
      let  qAs = this.user.getQAs();
      qAs.forEach((qa, i, ar)=>{
            if (isCorrect(qa.question, qa.answer)) crrAns++
        })
        return crrAns
        
    }
    getTotalScore(){
        return this.user.getTotalScore();
    }
    
   toString(){
      let  summary = `
        Summary
        +++++++++++++++++++++++++++++++++++
        Level: ${this.level}
        Total question: ${this.getQuestion()}
        Correct answer: ${this.getCorrectAns()}
        Wrong  answer : ${this.getQuestion() - this.getCorrectAns()}
        Total  score  : ${this.getTotalScore()}
        Relative Score: ${(this.getCorrectAns()/this.getQuestion()) * 100}
        +++++++++++++++++++++++++++++++++++
       `;
        return summary;
    } 
}


function isCorrect(q, a){
    
    return q.evaluate() == eval(a);
};
