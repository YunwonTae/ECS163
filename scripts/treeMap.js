//modification of: https://bl.ocks.org/mbostock/4063582
function treeMap(){
    //Margin for our vis
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
          width = 500 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom,
          color = d3.scaleOrdinal().range(d3.schemeCategory20c);

    //Call treeMap Api and set up the width and height
    var treemap = d3.treemap().size([width, height]);

    var legend = d3.select("#treeMap").append("svg")
                  .style("position", "relative")
                  .style("width", 200 + "px")
                  .style("height", 400 + "px")
                  .style("left", 100 + "px");

    //Setting up the canvas
    var canvas = d3.select("#treeMap").append("div")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top  + "px");

    d3.json("data/data.json", function(data) {

      var newData = { name :"root", children : [] },
          levels = ["Type1"];

      data.forEach(function(d){

          var depthCursor = newData.children;

          levels.forEach(function( property, depth ){
              var index;

              depthCursor.forEach(function(child,i){
                  if ( d[property] == child.name ) index = i;
              });

              if ( isNaN(index) ) {
                  depthCursor.push({ name : d[property], children : []});
                  index = depthCursor.length - 1;

              }

              depthCursor = depthCursor[index].children;

              if ( depth === levels.length - 1 ) depthCursor.push({ name : d.Type2, size : d.Size });
          });
      });

      //console.log(newData);
      //Formating the data
      var root = d3.hierarchy(newData, (d) => d.children)
      .sum((d) => d.size);
      var tree = treemap(root);
      //console.log("tree: ", tree);

      var tooltip = d3.select("#treeMap").append("div").attr("class", "toolTip").attr("id", "toolTip");

      var temp = 0;

      //console.log(tree.leaves())
      var types = tree.leaves()
      var type1 = []
      for (type in types){
          if (type1.includes(types[type].parent.data.name) === false){
              type1.push(types[type].parent.data.name)
          }
      }

      var colorLegend = legend.datum(root).selectAll("g")
                              .data(type1)
                              .enter().append("rect")
                              .attr("x", 10)
                              .attr("y", function(d){
                                  return temp+=20;
                              })
                              .style("fill", function(d) {
                                  return type_color(d);
                              })
                              .attr("width", 15)
                              .attr("height",15)

      temp = 0
      count = []
      //Color description
      //Adding text description right next to small rectangle
      legend.datum(root).selectAll("g")
                              .data(type1)
                              .enter().append("text")
                              .attr("x", 30)
                              .attr("y", function(d){
                                  return temp+=20;
                              })
                              .attr("dy", 13)
                              .text(function(d) { return d; })

      var tempArr = tree.leaves()

      var node = canvas.datum(root).selectAll(".node")
          .data(tempArr)
          .enter().append("div")
          .attr("class", "node")
          .style("left", (d) => d.x0 + "px")
          .style("top", (d) => d.y0 + "px")
          .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
          .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
          .style("background", function(d){
              return type_color(d.parent.data.name);
          })
          .html(function(d) { return d.data.name})
          .on("click", function(d){
            clicked(d.parent.data.name);
          })
          .on("mousemove", function (d) { //Adding toolTip
              console.log("hello")
              tooltip.style("left", d3.event.pageX - 190 + "px")
              tooltip.style("top", d3.event.pageY - 20 + "px")
              tooltip.style("display", "inline-block")
              tooltip.html(d.children ? null : "Type1: " + d.parent.data.name + "<br>" + "Type2: " + d.data.name + "<br>" + "Number of Pokemon: " + d.data.size);
          }).on("mouseout", function (d) {
              tooltip.style("display", "none");
          });

      });
      function clicked(type){
          var scatterElement = document.getElementById('scatterplot');
          scatterElement.innerHTML = '';
          scatterplot(type);
      }

      function type_color(d){
          if (d == "Bug"){
              return "#a8b820"
          }
          else if (d == "Grass"){
              return "#78c850"
          }
          else if (d == "Fire"){
              return "#f08030"
          }
          else if (d == "Water"){
              return "#6890f0"
          }
          else if (d == "Ice"){
              return "#98d8d8"
          }
          else if (d == "Electric"){
              return "#f8d030"
          }
          else if (d == "Psychic"){
              return "#f85888"
          }
          else if (d == "Ghost"){
              return "#705898"
          }
          else if (d == "Poison"){
              return "#a040a0"
          }
          else if (d == "Ground"){
              return "#e0c068"
          }
          else if (d == "Fighting"){
              return "#c03028"
          }
          else if (d == "Rock"){
              return "#b8a038"
          }
          else if (d == "Dark"){
              return "#705848"
          }
          else if (d == "Steel"){
              return "#b8b8d0"
          }
          else if (d == "Fairy"){
              return "#e898e8"
          }
          else if (d == "Dragon"){
              return "#7038f8"
          }
          else if (d == "Normal"){
              return "#8a8a59"
          }
          else if (d == "Flying"){
              return "#a890f0"
          }
      }

}
