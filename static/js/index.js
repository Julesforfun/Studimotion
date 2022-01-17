

const quiz= document.getElementById("quiz")
const answerEls = document.querySelectorAll('.answer')
const questionEl = document.getElementById('question')
const a_text = document.getElementById("a_text")
const b_text = document.getElementById('b_text')
const c_text = document.getElementById('c_text')
const d_text = document.getElementById('d_text')
const e_text = document.getElementById('e_text')
const eingabeLabel = document.getElementById('solutiontext')
const submitBtn = document.getElementById('submit')

var answeredCorrectNormal=[]
fillListswithAnswers(quizDataNormal, answeredCorrectNormal)
var answeredCorrectDifficult=[]
fillListswithAnswers(quizDataDifficult, answeredCorrectDifficult)
var answeredCorrectEasy=[]
fillListswithAnswers(quizDataEasy, answeredCorrectEasy)


//let currentQuiz = 0
let score = 0

//const currentQuizData = quizDataNormal[currentQuiz]
//getQuizData(difficulty)
loadQuiz();

function getQuizData(value){
  if (difficulty!=value){
    currentQuiz=0
  }
  setTimeout(function() { 
    if (value===1){

      getNextQuestionIndex(answeredCorrectDifficult);
     
    }
    if (value===-1){
      
      getNextQuestionIndex(answeredCorrectEasy);
    }
  
    if (value===0){
      console.log("anteorten2222!!!"+answeredCorrectNormal);
      getNextQuestionIndex(answeredCorrectNormal);
      
    }
}, 1000);
  
  difficulty=value;
  setTimeout(function() { 
    setQuiz(value); 
}, 1000);
  setTimeout(function() { 
    loadQuiz();
    adaptDiffCircle(difficulty);
}, 1000);
}

function setQuiz(value){
  if (value===1){
         currentQuizData = quizDataDifficult[currentQuiz]
    
  }
  if (value===-1){
   
    currentQuizData = quizDataEasy[currentQuiz]
    
  }

  if (value===0){
      currentQuizData = quizDataNormal[currentQuiz];
      console.log("currentquizswtQuiz"+currentQuiz)
      console.log(currentQuizData);
    
  }
}

function getNextQuestionIndex(mylist){

  console.log("currentquizgetnextindex"+currentQuiz)

  for (let i = currentQuiz; i < mylist.length; i++) { 
    if (mylist[i]==false){
      currentQuiz=i; 
      break;
    }
  }
  
}

function loadQuiz() {

  deselectAnswers();
  

  if (currentQuizData.eingabe=="yes"){

    document.getElementById("mysolution").style.visibility = "visible";
    eingabeLabel.style.visibility = "visible";
    
  }else{

    document.getElementById("mysolution").style.visibility = "hidden";
    eingabeLabel.style.visibility="hidden";
  }


  if (currentQuizData.pic=="no"){
    
    document.getElementById("taskpic").style.visibility = "hidden";
    document.getElementById("taskpic").style.width = "0";
    document.getElementById("taskpic").style.height = "0";
    
  }else{
    document.getElementById("taskpic").style.width = "300px";
    document.getElementById("taskpic").style.height = "200px";
    document.getElementById("taskpic").style.visibility = "visible";
    document.getElementById("taskpic").src = "/static/img/" +currentQuizData.pic;
    
  }
  questionEl.innerText = currentQuizData.question
  a_text.innerText = currentQuizData.a
  b_text.innerText = currentQuizData.b
  c_text.innerText = currentQuizData.c
  d_text.innerText = currentQuizData.d
  e_text.innerText = currentQuizData.e
 
 
}

function deselectAnswers() {
  answerEls.forEach(answerEl => answerEl.checked = false)
}

function getSelected() {
  let answer
  answerEls.forEach(answerEl => {
      if(answerEl.checked) {
          answer = answerEl.id
      }
  })
  return answer
}

function fillListswithAnswers(mylist, filllist){
  for (let i = 0; i < mylist.length; i++) { 
    filllist[i]=false;
  }
}

function saveCorrectAnswers(correctA){

  if (difficulty==0){  
      answeredCorrectNormal[currentQuiz]=correctA;
      console.log("anteorten!!!"+answeredCorrectNormal);
  }
  if (difficulty==1){  
    answeredCorrectDifficult[currentQuiz]=correctA;
  }
  if (difficulty==0){  
  answeredCorrectEasy[currentQuiz]=correctA;
  }
  
}


submitBtn.addEventListener('click', () => {
  const answer = getSelected()
  if(answer) {
     //if(answer === quizDataNormal[currentQuiz].correct) {
      if(answer === currentQuizData.correct) {
         score++
         saveCorrectAnswers(true);
      }else{
        saveCorrectAnswers(false);
      }

     setTimeout(function() { 
       saveLoggingData(currentQuiz, difficulty)
      currentQuiz++

     if(currentQuiz < quizDataNormal.length) {
         //loadQuiz(difficulty)
         getQuizData(difficulty)
         loadQuiz();
     } else {
         quiz.innerHTML = `
         <h2>You answered ${score}/${quizDataNormal.length} questions correctly</h2>

         <button onclick="location.reload()">Reload</button>
         `
     }
  }, 1000);
     
  }
})
