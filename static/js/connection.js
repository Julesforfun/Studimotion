

var intervalID = setInterval(update_values,1000);
var counter_Bored=0
var counter_Stressed=0
var difficulty=0
var numberOfTimesForDetection=3;
let currentQuiz = 0
var currentQuizData = quizDataNormal[currentQuiz]
var current_logging= []
var logging_data= [["current_var_bored/TN", "current_var_stressed/Diff", "interpretation/answ"]]
var gaveAnswer= "noAnswer";

    
      function update_values() {
        current_logging= [];
            $.getJSON($SCRIPT_ROOT + '/_stuff',
            
                   
          function(data) {
            $('#result').text(data.result);
            if (data.result==0){
              document.getElementById("result").textContent="active";
              current_logging.push("not_bored");
              
              if (data.result==1){
                document.getElementById("result").textContent="blinking";
              }

            }else{
              document.getElementById("result").textContent="drowsy";
              confirmAction_Bored(data.result_stress);
              current_logging.push("bored");
            }

            if(data.result_stress == 1)
            {
              document.getElementById("result_stress").textContent="stressed";
              confirmAction_Stressed(data.result);
              current_logging.push("stressed");
            }else{
              document.getElementById("result_stress").textContent="not sressed";
              current_logging.push("not_stressed");
            }


            logging_data.push(current_logging);
            //saveLoggingData(0,0);
            
            //console.log(data)
          });
          
        };

        
       
        function stopTextColor() {
          clearInterval(intervalID);
        }

        function confirmAction_Bored(stressed) {
          if (stressed==0){
            counter_Bored= counter_Bored+1;
            console.log("bored "+ counter_Bored);
            if (counter_Bored>numberOfTimesForDetection && difficulty!=1){ 
            
              let confirmAction = confirm("Sie scheinen gelangweilt zu sein. Sind Sie unterfordert?");
              var detectionBored= ["bored", "not_stressed", "DETECTION BORED"];
              logging_data.push(detectionBored);
              counter_Bored=0;
              counter_Stressed=0;
              if (confirmAction) {
                alert("Aufgaben werden angepasst");
                saveLoggingData(currentQuiz, difficulty, "noAnswer");
                getQuizData(difficulty+1);
              } 
            }
          }
        }

        function confirmAction_Stressed(bored) {
          counter_Stressed= counter_Stressed+1;
          console.log("stressed "+ counter_Stressed);
          if (counter_Stressed>numberOfTimesForDetection &&difficulty!=-1){ 
            let confirmAction = confirm("Sie scheinen gestresst zu sein. Sind Sie überfordert?");
            var detectionBored= ["not_bored", "stressed", "DETECTION STRESSED"];
            logging_data.push(detectionBored);
            counter_Stressed=0;
            counter_Bored=0;
            if (confirmAction) {
              alert("Aufgaben werden angepasst");
              saveLoggingData(currentQuiz, difficulty, "noAnswer");
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
      function interpretdetections(array){
        
        for (i=0; i<array.length; i++){
          var singlearray = array[i];
          
          //TODO mit yawn ==3
          if (singlearray.length==2){
            
            if (singlearray[0]=="not_bored" && singlearray[1]=="not_stressed"){
              singlearray.push("active");
              
            }
            if (singlearray[0]=="not_bored" && singlearray[1]=="stressed"){
              singlearray.push("stressed");
              
            }
            if (singlearray[0]=="bored" && singlearray[1]=="stressed"){
              singlearray.push("stressed");
             
            }
            if (singlearray[0]=="bored" && singlearray[1]=="not_stressed"){
              singlearray.push("bored");
            }

          }
         
        }

      }

      function saveLoggingData(taskNumber, diff, currgaveAnswer ){
        console.log("taskNumber: "+ taskNumber);
        console.log("diffic: "+ diff);
        //var array = [["name", "age", "height"], ["name2", "age2", "height2"]];
        var myyarray= logging_data;
        interpretdetections(myyarray);
        setTimeout(function() {
          
          myyarray.push([taskNumber, diff, currgaveAnswer]);
          var file = "data:text/csv;charset=utf-8,";
  
          for (i=0; i<myyarray.length; i++){
            var csv = myyarray[i].join(",");
            file= file+csv+"\n";
          }
          
          console.log(csv);
          var encoded_file = encodeURI(file);
          var link = document.createElement("a");
          link.setAttribute("href", encoded_file);
          var csvname= ""+taskNumber+diff+".csv";
          link.setAttribute("download", csvname);
          document.body.appendChild(link);
          link.click();
        }, 1000);
        logging_data=[["current_var_bored/TN", "current_var_stressed/Diff", "interpretation/answ"]];   
      }

      

      

      