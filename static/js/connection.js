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
              //confirmAction(counter);
              
            }
            console.log(data)
          });
          
        };
       
        function stopTextColor() {
          clearInterval(intervalID);
        }

        function confirmAction() {
          counter= counter+1;
          if (counter>10){ 
          let confirmAction = confirm("Sind Sie unterfordert?");
          if (confirmAction) {
            alert("Aufgaben werden angepasst");
          } }
        }
        