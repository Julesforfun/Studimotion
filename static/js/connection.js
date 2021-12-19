var intervalID = setInterval(update_values,1000);
var counter=0
var counter1=0
var difficulty=0

    
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
              adaptAnswer(difficulty+1)
              //document.getElementById("circle").style.background='red';
              //document.getElementById("circle_difficulty").textContent="Difficulty: High";
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
              adaptAnswer(difficulty-1)
              //document.getElementById("circle").style.background='green';
              //document.getElementById("circle_difficulty").textContent="Difficulty: Normal";
            } 
          }
        }

      
        function adaptAnswer(value){
          const answerEls = document.querySelectorAll('.answer')
          const buttonc=  answerEls[2]
          const buttond= answerEls[3]
          const a_text = document.getElementById('a_text')
          const b_text = document.getElementById('b_text')
          const c_text = document.getElementById('c_text')
          const d_text = document.getElementById('d_text')
          const questionEl = document.getElementById('question')
          
          if (value==-1){
            //document.getElementById("myBtn").innerText = "Close activity graph";
            c_text.style.visibility = "hidden"
            d_text.style.visibility = "hidden"
            buttonc.style.visibility="hidden"
            buttond.style.visibility="hidden" 
            difficulty=-1;
            document.getElementById("circle").style.background='grey';
            document.getElementById("circle_difficulty").textContent="Difficulty: Light";
          }else{
            
            c_text.style.visibility = "visible"
            d_text.style.visibility = "visible"
            buttonc.style.visibility="visible"
            buttond.style.visibility="visible" 
            difficulty=0;
            document.getElementById("circle").style.background='green';
            document.getElementById("circle_difficulty").textContent="Difficulty: Normal";
        }
        if (value==1){
          
          c_text.innerHTML= "have never been"
          d_text.innerHTML= "was never"
          a_text.innerHTML= "had never been"
          b_text.innerHTML= "was never being"
          questionEl.innerHTML="Fill in the right tense : I _______ in London"

          document.getElementById("circle").style.background='red';
          document.getElementById("circle_difficulty").textContent="Difficulty: High";
          }
      }
        