//modification of: https://bl.ocks.org/mbostock/4063582
function treeMap(){
    //Margin for our vis
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
          width = 500 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom,
          color = d3.scaleOrdinal().range(d3.schemeCategory20c);

    //Call treeMap Api and set up the width and height
    var treemap = d3.treemap().size([width, height]);

    //Setting up the canvas
    var canvas = d3.select("#treeMap").append("div")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

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
              console.log(d)
              if (d.parent.data.name == "Bug"){
                  return "lightgreen"
              }
              else if (d.parent.data.name == "Grass"){
                  return "green"
              }
              else if (d.parent.data.name == "Fire"){
                  return "red"
              }
              else if (d.parent.data.name == "Water"){
                  return "blue"
              }
              else if (d.parent.data.name == "ice"){
                  return "lightblue"
              }
              else if (d.parent.data.name == "Electric"){
                  return "yellow"
              }
              else if (d.parent.data.name == "Psychic"){
                  return "#e600e6"
              }
              else if (d.parent.data.name == "Ghost"){
                  return "#4d004d"
              }
              else if (d.parent.data.name == "Poison"){
                  return "Purple"
              }
              else if (d.parent.data.name == "Ground"){
                  return "SaddleBrown"
              }
              else if (d.parent.data.name == "Fighting"){
                  return "#ca641c"
              }
              else if (d.parent.data.name == "Rock"){
                  return "#808080"
              }
              else if (d.parent.data.name == "Dark"){
                  return "#262626"
              }
              else if (d.parent.data.name == "Steel"){
                  return "silver"
              }
              else if (d.parent.data.name == "Fairy"){
                  return "Pink"
              }
              else if (d.parent.data.name == "Dragon"){
                  return "Gold"
              }
              else if (d.parent.data.name == "Normal"){
                  return "White"
              }
              else if (d.parent.data.name == "Flying"){
                  return "#F0F8FF"
              }
              return color(d.parent.data.name);
          })
          .html(function(d) { return d.data.name})
          .on("click", function(d){
            clicked(d.parent.data.name);
          })
          .on("mousemove", function (d) { //Adding toolTip
              tooltip.style("left", d3.event.pageX - 200 + "px")
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

}
