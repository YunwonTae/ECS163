function parallelCoord(data){
	let parallelContainer = document.getElementById('parallel');
	parallelContainer.innerHTML = '';

	var margin = {top: 66, right: 110, bottom: 20, left: 188},
		width = document.body.clientWidth - margin.left - margin.right,
		height = 340 - margin.top - margin.bottom,
		innerHeight = height - 2;

	var devicePixelRatio = window.devicePixelRatio || 1;

	var color = d3.scaleOrdinal(d3.schemeCategory20);
	 
	var types = {
	  "Number": {
		key: "Number",
		coerce: function(d) { return +d; },
		extent: d3.extent,
		within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
		defaultScale: d3.scaleLinear().range([innerHeight, 0])
	  },
	  "String": {
		key: "String",
		coerce: String,
		extent: function (data) { return data.sort(); },
		within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
		defaultScale: d3.scalePoint().range([0, innerHeight])
	  },
	  "Date": {
		key: "Date",
		coerce: function(d) { return new Date(d); },
		extent: d3.extent,
		within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
		defaultScale: d3.scaleTime().range([0, innerHeight])
	  }
	};

	var dimensions = [
	  {
		key: "type2",
		description: "type2",
		type: types["String"],
		axis: d3.axisLeft()
		  .tickFormat(function(d,i) {
			return d;
		  })
	  },
	  {
		key: "against_bug",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_dark",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_dragon",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_electric",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_fairy",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_fight",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_fire",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_flying",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_ghost",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_grass",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_ground",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_ice",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_normal",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_poison",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_psychic",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_rock",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_steel",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	  {
		key: "against_water",
		type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	  },
	 //  {
		// key: "attack",
		// type: types["Number"],
		// scale: d3.scaleSqrt().range([innerHeight, 0])
	 //  },
	 //  {
		// key: "defense",
		// type: types["Number"],
		// // scale: d3.scaleSqrt().range([innerHeight, 0])
	 //  },
	 //  {
		// key: "base_total",
		// type: types["Number"],
		// // scale: d3.scaleSqrt().range([innerHeight, 0])
	 //  },
	  // {
		// key: "type2",
		// description: "Type2",
		// type: types["String"],
		// axis: d3.axisRight()
		//   .tickFormat(function(d,i) {
		// 	// if (d == null) return "(null)";
		// 	// return i % 5 == 0 ? d.slice(0,22) : "";
		// 	return d;
		//   })
	  // }
	];

	var xscale = d3.scalePoint()
		.domain(d3.range(dimensions.length))
		.range([0, width]);

	var yAxis = d3.axisLeft();

	var container = d3.select("#parallel").append("div")
		.attr("class", "parcoords")
		.style("width", width + margin.left + margin.right + "px")
		.style("height", height + margin.top + margin.bottom + "px");

	var svg = container.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var canvas = container.append("canvas")
		.attr("width", width * devicePixelRatio)
		.attr("height", height * devicePixelRatio)
		.style("width", width + "px")
		.style("height", height + "px")
		.style("margin-top", margin.top + "px")
		.style("margin-left", margin.left + "px");

	var ctx = canvas.node().getContext("2d");
	ctx.globalCompositeOperation = 'darken';
	ctx.globalAlpha = 0.15;
	ctx.lineWidth = 1.5;
	ctx.scale(devicePixelRatio, devicePixelRatio);

	//var output = d3.select("#parallel").append("pre");

	var axes = svg.selectAll(".axis")
		.data(dimensions)
	  .enter().append("g")
		.attr("class", function(d) { return "axis " + d.key.replace(/ /g, "_"); })
		.attr("transform", function(d,i) { return "translate(" + xscale(i) + ")"; });

	for (var i in data){
		if (data[i].type2 == ""){
			data[i].type2 = "only"
		}
	}

	console.log(data)
	dataParse(data);

	function dataParse(data) {

	  data = d3.shuffle(data);

	  data.forEach(function(d) {
		dimensions.forEach(function(p) {
		  d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
		});

		// truncate long text strings to fit in data table
		for (var key in d) {
		  if (d[key] && d[key].length > 35) d[key] = d[key].slice(0,36);
		}
	  });

	  // type/dimension default setting happens here
	  dimensions.forEach(function(dim) {
		if (!("domain" in dim)) {
		  // detect domain using dimension type's extent function
		  dim.domain = d3_functor(dim.type.extent)(data.map(function(d) { return d[dim.key]; }));
		  if ( (typeof dim.domain[0]) != "string"){
			  dim.domain[0] = 0;
		  }
		}
		if (!("scale" in dim)) {
		  // use type's default scale for dimension
		  dim.scale = dim.type.defaultScale.copy();
		}
		dim.scale.domain(dim.domain);
	  });

	  var render = renderQueue(draw).rate(1);

	  ctx.clearRect(0,0,width,height);
	  ctx.globalAlpha = d3.min([0.85/Math.pow(data.length,0.3),1]);
	  render(data);

	  axes.append("g")
		  .each(function(d) {
			var renderAxis = "axis" in d
			  ? d.axis.scale(d.scale)  // custom axis
			  : yAxis.scale(d.scale);  // default axis
			d3.select(this).call(renderAxis);
		  })
		.append("text")
		  .attr("class", "title")
		  .attr("text-anchor", "start")
		  .text(function(d) { return "description" in d ? d.description : d.key; });

	  // Add and store a brush for each axis.
	  axes.append("g")
		  .attr("class", "brush")
		  .each(function(d) {
			d3.select(this).call(d.brush = d3.brushY()
			  .extent([[-10,0], [10,height]])
			  .on("start", brushstart)
			  .on("brush", brush)
			  .on("end", brush)
			)
		  })
		.selectAll("rect")
		  .attr("x", -8)
		  .attr("width", 16);

	  d3.selectAll(".axis.type2 .tick text")
		.style("fill", color);

	  //output.text(d3.tsvFormat(data.slice(0,24)));

	  function project(d) {
		return dimensions.map(function(p,i) {
		  // check if data element has property and contains a value
		  if (
			!(p.key in d) ||
			d[p.key] === null
		  ) return null;

		  return [xscale(i),p.scale(d[p.key])];
		});
	  };

	  function draw(d) {
		ctx.strokeStyle = color(d.type2);
		ctx.beginPath();
		var coords = project(d);
		coords.forEach(function(p,i) {
		  // this tricky bit avoids rendering null values as 0
		  if (p === null) {
			// this bit renders horizontal lines on the previous/next
			// dimensions, so that sandwiched null values are visible
			if (i > 0) {
			  var prev = coords[i-1];
			  if (prev !== null) {
				ctx.moveTo(prev[0],prev[1]);
				ctx.lineTo(prev[0]+6,prev[1]);
			  }
			}
			if (i < coords.length-1) {
			  var next = coords[i+1];
			  if (next !== null) {
				ctx.moveTo(next[0]-6,next[1]);
			  }
			}
			return;
		  }

		  if (i == 0) {
			ctx.moveTo(p[0],p[1]);
			return;
		  }

		  ctx.lineTo(p[0],p[1]);
		});
		ctx.stroke();
	  }

	  function brushstart() {
		d3.event.sourceEvent.stopPropagation();
	  }

	  // Handles a brush event, toggling the display of foreground lines.
	  function brush() {
		render.invalidate();

		var actives = [];
		svg.selectAll(".axis .brush")
		  .filter(function(d) {
			return d3.brushSelection(this);
		  })
		  .each(function(d) {
			actives.push({
			  dimension: d,
			  extent: d3.brushSelection(this)
			});
		  });

		var selected = data.filter(function(d) {
		  if (actives.every(function(active) {
			  var dim = active.dimension;
			  // test if point is within extents for each active brush
			  return dim.type.within(d[dim.key], active.extent, dim);
			})) {
			return true;
		  }
		});

		// show ticks for active brush dimensions
		// and filter ticks to only those within brush extents
		/*
		svg.selectAll(".axis")
			.filter(function(d) {
			  return actives.indexOf(d) > -1 ? true : false;
			})
			.classed("active", true)
			.each(function(dimension, i) {
			  var extent = extents[i];
			  d3.select(this)
				.selectAll(".tick text")
				.style("display", function(d) {
				  var value = dimension.type.coerce(d);
				  return dimension.type.within(value, extent, dimension) ? null : "none";
				});
			});

		// reset dimensions without active brushes
		svg.selectAll(".axis")
			.filter(function(d) {
			  return actives.indexOf(d) > -1 ? false : true;
			})
			.classed("active", false)
			.selectAll(".tick text")
			  .style("display", null);
		*/

		ctx.clearRect(0,0,width,height);
		ctx.globalAlpha = d3.min([0.85/Math.pow(selected.length,0.3),1]);
		render(selected);

		//output.text(d3.tsvFormat(selected.slice(0,24)));
	  }
	};

	function d3_functor(v) {
	  return typeof v === "function" ? v : function() { return v; };
	};
}
