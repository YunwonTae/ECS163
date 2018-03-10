//positioning/sizing    
var margin = {top: 20, right: 20, bottom: 30, left: 45},
    svg_dx = 310, 
    svg_dy = 150,
    plot_dx = svg_dx - margin.right - margin.left,
    plot_dy = svg_dy - margin.top - margin.bottom;

var x = d3.scaleLinear().range([margin.left, plot_dx]),
y = d3.scaleLinear().range([plot_dy, margin.top]);


var svg = d3.select("body").append("svg")
        .append("svg")
        .attr("width", svg_dx)
        .attr("height", svg_dy);

var type = "steel";
console.log("type: ", type)
//load data
d3.csv("pokemon.csv", (function(dataU){
      //create map of data
      dataU = dataU.map(function(d) { 
        return {
            type1: d.type1,
            type2: d.type2,
            name: d.name,
            attack: d.attack,
            defense: d.defense
        };
      })

      console.log("unfiltered", dataU)

    var data = [];
    dataU.forEach(function(pokemon){
        if(pokemon.type1 == type)
            data.push(pokemon)});
    console.log("filtered", data)



//scale/size visualization
var n = data.length;

var d_extent_x = d3.extent(data, data => +data.attack),
    d_extent_y = d3.extent(data, data => +data.defense);

x.domain(d_extent_x);
y.domain(d_extent_y);

var axis_x = d3.axisBottom(x),
    axis_y = d3.axisLeft(y);


svg.append("g")
   .attr("id", "axis_x")
   .attr("transform", "translate(0," + (plot_dy + margin.bottom / 2) + ")")
   .call(axis_x);

svg.append("g")
   .attr("id", "axis_y")
   .attr("transform", "translate(" + (margin.left / 2) + ", 0)")
   .call(axis_y);

d3.select("#axis_x")
  .append("text")
  .attr("transform", "translate(360, -10)")
  .text("Attack");

d3.select("#axis_y")
  .append("text")
  .attr("transform", "rotate(-90) translate(-20, 15)")
  .text("Defense");

// handles marks
var circles = svg.append("g")
                 .selectAll("circle")
                 .data(data)
                 .enter()
                 .append("circle")
                 .attr("r", 5)
                 .attr("cx", (data) => x(data.attack))
                 .attr("cy", (data) => y(data.defense))
                 .attr("class", "non_brushed");

//handles dragging and highlighting points
function highlightBrushedCircles() {

    if (d3.event.selection != null) {

        // revert circles to initial style
        circles.attr("class", "non_brushed");

        var brush_coords = d3.brushSelection(this);

        // style brushed circles
        circles.filter(function (){

                   var cx = d3.select(this).attr("cx"),
                       cy = d3.select(this).attr("cy");

                   return isBrushed(brush_coords, cx, cy);
               })
               .attr("class", "brushed");
    }
}
/*
//handles table of values that show up when points are highlighted
function displayTable() {

    // disregard brushes w/o selections  
    if (!d3.event.selection) return;

    // programmed clearing of brush after mouse-up
    d3.select(this).call(brush.move, null);

    var d_brushed =  d3.selectAll(".brushed").data();

    // populate table if one or more elements is brushed
    if (d_brushed.length > 0) {
        clearTableRows();
        d_brushed.forEach(d_row => populateTableRow(d_row))
    } else {
        clearTableRows();
    }
}

var brush = d3.brush()
              .on("brush", highlightBrushedCircles)
              .on("end", displayTable); 

svg.append("g")
   .call(brush);
});







// shows/hides table when different stuff is highlighted
function clearTableRows() {

hideTableColNames();
d3.selectAll(".row_data").remove();
}

function isBrushed(brush_coords, cx, cy) {

 var x0 = brush_coords[0][0],
     x1 = brush_coords[1][0],
     y0 = brush_coords[0][1],
     y1 = brush_coords[1][1];

return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}

function hideTableColNames() {
d3.select("body").select("table1").style("visibility", "hidden");
}

function showTableColNames() {
d3.select("body").select("table").style("visibility", "visible");
}

function populateTableRow(d_row) {

showTableColNames();

var d_row_filter = [d_row.date,
                    d_row.opening, 
                    d_row.closing,
                    d_row.delta];

d3.select("table")
  .append("tr")
  .attr("class", "row_data")
  .selectAll("td")
  .data(d_row_filter)
  .enter()
  .append("td")
  .attr("align", (d, i) => i == 0 ? "left" : "right")
  .text(d => d);
}*/

}
)
)