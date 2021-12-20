var intervalID = setInterval(update_values,1000);
var counter=0
var counter1=0
var difficulty=0
let currentQuiz = 0
var currentQuizData = quizDataNormal[currentQuiz]

    
      function update_values() {
            $.getJSON($SCRIPT_ROOT + '/_stuff',
                   
          function(data) {
            $('#result').text(data.result);
            if (data.result==0){
              document.getElementById("result").textContent="active";
              
              if (data.result==1){
                document.getElementById("result").textContent="blinking";
              }

            }else{
              document.getElementById("result").textContent="drowsy";
              confirmAction();
            }

            if(data.result_stress == 1)
            {
              document.getElementById("result_stress").textContent="stressed";
              confirmAction_Stressed();
            }else{
              document.getElementById("result_stress").textContent="not stressed";
            }


            //console.log(data)
          });
          
        };
       
        function stopTextColor() {
          clearInterval(intervalID);
        }

        function confirmAction() {
          counter= counter+1;
          console.log(counter)
          if (counter>5 && difficulty!=1){ 
            let confirmAction = confirm("Sind Sie unterfordert?");
            counter=0;
            if (confirmAction) {
              alert("Aufgaben werden angepasst");
              
              console.log("diff"+difficulty)
              getQuizData(difficulty+1)
              
            } 
          }
        }

        function confirmAction_Stressed() {
          counter1= counter1+1;
          //console.log(counter1)
          if (counter1>1 &&difficulty!=-1){ 
            let confirmAction = confirm("Sie scheinen gestresst zu sein. Sind Sie überfordert?");
            counter1=0;
            if (confirmAction) {
              alert("Aufgaben werden angepasst");
              getQuizData(difficulty-1);              
            } 
          }
        }

      
        function adaptDiffCircle(value){
          
          
          if (value==-1){
            
            document.getElementById("circle").style.background='grey';
            document.getElementById("circle_difficulty").textContent="Difficulty: Light";
          }else{
            
           
            document.getElementById("circle").style.background='green';
            document.getElementById("circle_difficulty").textContent="Difficulty: Normal";
        }
        if (value==1){

          document.getElementById("circle").style.background='red';
          document.getElementById("circle_difficulty").textContent="Difficulty: High";
          }
      }


      