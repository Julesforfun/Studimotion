

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


let currentQuiz = 0
let score = 0

loadQuiz()

function loadQuiz() {

  deselectAnswers()

  const currentQuizData = quizDataNormal[currentQuiz]

  if (difficulty==-1){

    const currentQuizData = quizDataEasy[currentQuiz]
  }

  if (difficulty==1){

    const currentQuizData = quizDataDifficult[currentQuiz]
  }

  

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


submitBtn.addEventListener('click', () => {
  const answer = getSelected()
  if(answer) {
     if(answer === quizDataNormal[currentQuiz].correct) {
         score++
     }

     currentQuiz++

     if(currentQuiz < quizDataNormal.length) {
         loadQuiz()
     } else {
         quiz.innerHTML = `
         <h2>You answered ${score}/${quizDataNormal.length} questions correctly</h2>

         <button onclick="location.reload()">Reload</button>
         `
     }
  }
})
