
document.getElementById("myBtn").onclick = function() {showChart()};
mydata=[]
timesteps=[]
underchallenged_values=[]
overchallenged_values=[]
graph_visible= false
var svg=null; 




/**d3.csv("/static/data/outtest.csv", function(data) {
  
  data.forEach(function(d) {
  mydata= data;
  
  });
  
 
});**/

function showChart() {
  
  if (graph_visible){
    graph_visible=false;
    document.getElementById("myBtn").innerText = "Zeige Aktivitätsgraph";
    svg.remove()

  }else{
    createChart();
  }
  
}

function createChart(){

  document.getElementById("myBtn").innerText = "Aktivitätsgraph schließen";
  graph_visible= true;

  // Get the data
  d3.csv("/static/data/myfile.csv", function(error, data) {
    mydata=data
    mydata.forEach(function(d) {
      d.timestep = +(d.timestep);
      d.under = +d.under;
      d.over= +d.over
      
    });
    console.log(mydata)
  
    // Set the dimensions of the canvas / graph
  var	margin = {top: 30, right: 20, bottom: 30, left: 50},
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;
  
  // Parse the date / time
  var	parseDate = d3.time.format("%d-%b-%y").parse;
  
  // Set the ranges
  var	x = d3.scale.linear().range([0, width]);
  var	y = d3.scale.linear().range([height, 0]);
  
  // Define the axes
  var	xAxis = d3.svg.axis().scale(x)
  .orient("bottom").ticks(10);
  
  var	yAxis = d3.svg.axis().scale(y)
  .orient("left").ticks(2);

  let tickLabels = ['Unt.','Nor.','Üb.'];
  yAxis.tickFormat((d,i) => tickLabels[i]);
  //yAxis.tickSize(-200);
  
  // Define the line
  var	valueline = d3.svg.line()
  .x(function(d) { return x(d.timestep); })
  .y(function(d) { return y(d.under); });
  
  // Define the line
  //var	valueline2 = d3.svg.line()
  //.x(function(d) { return x(d.timestep); })
  //.y(function(d) { return y(d.over); });
  
  // Adds the svg canvas
  svg = d3.select("#quiz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  
    // Scale the range of the data
    x.domain(d3.extent(mydata, function(d) { return d.timestep; }));
    y.domain([0, d3.max(mydata, function(d) { return d.under; })]);
  
    
  
    // Add the valueline path.
    svg.append("path")		// Add the valueline path.
      .attr("class", "line")
      .attr("d", valueline(mydata));
  
    
    svg.append("path")		// Add the valueline path.
      .attr("class", "line")
      .attr("stroke", "red");
      //.attr("d", valueline2(mydata));
      
  
    // Add the X Axis
    svg.append("g")			// Add the X Axis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
    // Add the Y Axis
    svg.append("g")			// Add the Y Axis
      .attr("class", "y axis")
      .call(yAxis);
  
  });


}






  
  


