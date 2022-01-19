

var intervalID = setInterval(update_values,1000);
var counter_Bored=0
var counter_Stressed=0
var difficulty=0
var numberOfTimesForDetection=5;
let currentQuiz = 0
var currentQuizData = quizDataNormal[currentQuiz]
var current_logging= []
var logging_data= [["current_var_bored/TN", "current_var_stressed/Diff", "interpretation/answ"]]
var gaveAnswer= "noAnswer";
var isYawning = 0;
var showPopUp=true;


    
      function update_values() {
        current_logging= [];
            $.getJSON($SCRIPT_ROOT + '/_stuff',
            
                   
          function(data) {
            $('#result').text(data.result);
            console.log("value result = "+ data.result);
            if (data.result==0){
              document.getElementById("result").textContent="active";
              current_logging.push("not_bored");
              
              if (data.result==1){
                document.getElementById("result").textContent="blinking";
              }
            
            }else{

              //if (data.result==3){
                if (data.result_yawn==3){
                isYawning = 1;
                document.getElementById("result").textContent="yawned";
                current_logging.push("bored-yawned");
                console.log("Just yawned");

              }else{

                
                document.getElementById("result").textContent="drowsy";
                current_logging.push("bored");

              }
              
              console.log("check confirm");
              
              confirmAction_Bored(data.result_stress, data.result_yawn, data.result);
              
             
              
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

        function confirmAction_Bored(stressed, datayawn, databored) {
          confirmAction=false;
          if (stressed==0 || isYawning==1){
            console.log("Yawning = "+isYawning);
            counter_Bored= counter_Bored+1;
            console.log("bored "+ counter_Bored);
            //if ((counter_Bored>numberOfTimesForDetection && difficulty!=1 ) || (isYawning==1 && difficulty!=1)){ 
            if ((counter_Bored>numberOfTimesForDetection && difficulty!=1 ) || (datayawn==3 && difficulty!=1)){ 
            
              if (showPopUp){
                confirmAction = confirm("Sie scheinen gelangweilt zu sein. Sind Sie unterfordert?");
              }
              
              //if(datayawn == 3)
              if(datayawn == 3 && databored==2)
              {
                var detectionBored= ["bored-YAWNED", "not_stressed", "DETECTION BORED (YAWN)"];
                isYawning = 0;
                //counter_Bored=0;
                //counter_Stressed=0;
                console.log("DEZECTION YAAAAWNING");
              }else
              {
                var detectionBored= ["bored", "not_stressed", "DETECTION BORED"];
              }
              logging_data.push(detectionBored);
              counter_Bored=0;
              counter_Stressed=0;
              if (confirmAction) {
                alert("Aufgaben werden angepasst");
                saveLoggingData(currentQuiz, difficulty, "noAnswer");
                getQuizData(difficulty+1);
              } 
            }
            //nur für logging relevant
            if (difficulty==1){
              var detectionBored=[]
              if ((counter_Bored>numberOfTimesForDetection )){ 
                detectionBored= ["bored", "not_stressed", "DETECTION BORED"];
                counter_Bored=0;
              }
              if (datayawn==3 && databored==2 ){
                detectionBored= ["bored-YAWNED", "not_stressed", "DETECTION BORED (YAWN)"];
              }
              logging_data.push(detectionBored);  
            }
            
          }
        }

        function confirmAction_Stressed(bored) {
          confirmAction=false;
          counter_Stressed= counter_Stressed+1;
          console.log("stressed "+ counter_Stressed);
          if (counter_Stressed>numberOfTimesForDetection &&difficulty!=-1){
            if (showPopUp){ 
              confirmAction = confirm("Sie scheinen gestresst zu sein. Sind Sie überfordert?");}
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
          //nur für logging relevant 
          if (difficulty==-1 &&counter_Stressed>numberOfTimesForDetection){
            var detectionBored= ["not_bored", "stressed", "DETECTION STRESSED"];
            logging_data.push(detectionBored); 
            counter_Stressed=0      
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
            if (singlearray[0]=="bored-yawned" && singlearray[1]=="not_stressed"){
              singlearray.push("bored-yawned");

            }
          }
         
        }

      }

      function saveLoggingData(taskNumber, diff, currgaveAnswer ){
        
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
          
          //console.log(csv);
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

      

      

      

      