
document.getElementById("myBtn").onclick = function() {showChart()};
mydata=[]
timesteps=[]
underchallenged_values=[]
overchallenged_values=[]
d3.csv("/static/data/out.csv", function(data) {
  
  data.forEach(function(d) {
  d['Time'] = +d['Time'];
  d['Unterfordert'] = +d['Unterfordert'];
  d['Überfordert'] = +d['Überfordert'];
  //console.log(data)
  mydata= data;
  
  });
  
 
});

function showChart() {
  console.log(mydata)
  for (i=0; i<mydata.length; i++){
    timesteps=mydata[i].Time;
    underchallenged_values= mydata[i].Unterfordert;
    overchallenged_values= mydata[i].Überfordert;
  }

  createChart();

}

function createChart(){
  //TODO create a line chart
  

}



  
  


