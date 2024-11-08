//positioning/sizing
function scatterplot(type_given){
    var margin = {top: 20, right: 20, bottom: 30, left: 45},
        svg_dx = 560,
        svg_dy = 410,
        plot_dx = svg_dx - margin.right - margin.left,
        plot_dy = svg_dy - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([margin.left, plot_dx]),
    y = d3.scaleLinear().range([plot_dy, margin.top]);

    var svg = d3.select("#scatterplot").append("svg")
            .attr("width", svg_dx)
            .attr("height", svg_dy);

    type_given = type_given.toLowerCase();
    var type = type_given;
    //console.log("type:", type_given)

    //load data
    d3.csv("data/pokemon.csv", (function(dataU){
          //create map of data
          dataU = dataU.map(function(d) {
            return {
                type1: d.type1,
                type2: d.type2,
                name: d.name,
                attack: d.attack,
                defense: d.defense,
                against_bug: d.against_bug,
                against_dark: d.against_dark,
                against_dragon: d.against_dragon,
                against_electric: d.against_electric,
                against_fairy: d.against_fairy,
                against_fight: d.against_fight,
                against_fire: d.against_fire,
                against_flying: d.against_flying,
                against_ghost: d.against_ghost,
                against_grass: d.against_grass,
                against_ground: d.against_ground,
                against_ice: d.against_ice,
                against_normal: d.against_normal,
                against_poison: d.against_poison,
                against_psychic: d.against_psychic,
                against_rock: d.against_rock,
                against_steel: d.against_steel,
                against_water: d.against_water
            };
          })

          //console.log("unfiltered", dataU)

        var data = [];
        dataU.forEach(function(pokemon){
            if(pokemon.type1 == type)
                data.push(pokemon)});
        //console.log("filtered", data)

        function type_color(d){
            if (d == "bug"){
                return "#a8b820"
            }
            else if (d == "grass"){
                return "#78c850"
            }
            else if (d == "fire"){
                return "#f08030"
            }
            else if (d == "water"){
                return "#6890f0"
            }
            else if (d == "ice"){
                return "#98d8d8"
            }
            else if (d == "electric"){
                return "#f8d030"
            }
            else if (d == "psychic"){
                return "#f85888"
            }
            else if (d == "ghost"){
                return "#705898"
            }
            else if (d == "poison"){
                return "#a040a0"
            }
            else if (d == "ground"){
                return "#e0c068"
            }
            else if (d == "fighting"){
                return "#c03028"
            }
            else if (d == "rock"){
                return "#b8a038"
            }
            else if (d == "dark"){
                return "#705848"
            }
            else if (d == "steel"){
                return "#b8b8d0"
            }
            else if (d == "fairy"){
                return "#e898e8"
            }
            else if (d == "dragon"){
                return "#7038f8"
            }
            else if (d == "normal"){
                return "#8a8a59"
            }
            else if (d == "flying"){
                return "#a890f0"
            }
        }

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
           .attr("transform", "translate(" + (margin.left / 1) + ", 0)")
           .call(axis_y);

        d3.select("#axis_x")
          .append("text")
          .attr("transform", "translate(360, -10)")
          .text("Attack");

        d3.select("#axis_y")
          .append("text")
          .attr("transform", "rotate(-90) translate(-20, 15)")
          .text("Defense");

        var tooltip = d3.select("#scatterplot").append("div").attr("class", "toolTip").attr("id", "toolTip");

        // handles marks
        // var text = svg.append("text")
        //         .
        console.log(data);
        var title = data[0].type1.toUpperCase();
        $('#scatterplot').prepend(`<h3>${title}</h3>`);
        var circles = svg.append("g")
                         .selectAll("circle")
                         .data(data)
                         .enter()
                         .append("circle")
                         .attr("r", 5)
                         .attr("cx", (data) => x(data.attack))
                         .attr("cy", (data) => y(data.defense))
                         .attr("class", "non_brushed")
                         .style("fill", function(d){
                            return d.type2 == ""
                              ? type_color(d.type1)
                              : type_color(d.type2);
                            })
                        .on("mousemove", function (d) { //Adding toolTip
                            //console.log("scatter: ",d);
                            tooltip.style("left", d3.event.pageX + 20 + "px")
                            tooltip.style("top", d3.event.pageY - 20 + "px")
                            tooltip.style("display", "inline-block")
                            tooltip.html(d.children ? null : "Name: " + d.name + "<br>" + "Attack: " + d.attack + "<br>" + "Defense: " + d.defense);
                        }).on("mouseout", function (d) {
                            tooltip.style("display", "none");
                        });

        // //handles dragging and highlighting points
        function highlightBrushedCircles() {

            if (d3.event.selection != null) {

                // revert circles to initial style
                circles.attr("class", "non_brushed")
                        .attr("r", 5);

                var brush_coords = d3.brushSelection(this);

                // style brushed circles
                circles.filter(function (){

                           var cx = d3.select(this).attr("cx"),
                               cy = d3.select(this).attr("cy");

                           return isBrushed(brush_coords, cx, cy);
                       })
                       .attr("class", "brushed")
                       .attr("r", 8);
            }
        }

        //handles points that are highlighted
        function passData() {

            // disregard brushes w/o selections
            if (!d3.event.selection) return;

            // programmed clearing of brush after mouse-up
            d3.select(this).call(brush.move, null);

            var d_brushed =  d3.selectAll(".brushed").data();
			console.log(d_brushed);
			parallelCoord(d_brushed);
        }

        var brush = d3.brush()
                      .on("brush", highlightBrushedCircles)
                      .on("end", passData);
        //
        //
        // svg.append("g")
        //     .attr("id", "brush")
        //     .call(brush);

        function isBrushed(brush_coords, cx, cy) {
            var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];

            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }

        //Scatter Plot: Button Trigger
        var YesMode = true;
          $(".Yes").click(function() {
              svg.append("g")
                  .attr("id", "brush")
                  .call(brush);
          });
          var NoMode = true;
          $(".No").click(function() {
            //document.getElementById('brush').innerHTML = '';
            var svg = d3.select("#brush").remove();
            //svg.select("g").remove();

          });

    }));
}
