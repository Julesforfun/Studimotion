var intervalID = setInterval(update_values,1000);
var counter=0
    
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
            //console.log(data)
          });
          
        };
       
        function stopTextColor() {
          clearInterval(intervalID);
        }

        function confirmAction() {
          counter= counter+1;
          console.log(counter)
          if (counter>5){ 
            let confirmAction = confirm("Sind Sie unterfordert?");
            counter=0;
            if (confirmAction) {
              alert("Aufgaben werden angepasst");
            } 
          }
        }
        