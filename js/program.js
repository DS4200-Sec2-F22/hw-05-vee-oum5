// dimensions of the scatter plot canvas and the margin for all plot canvas
const FRAME = 500;
const MARGINS = {left: 100, right: 50, top: 50, bottom: 50};
// where the visulaization will be displayed
const VIS = FRAME - MARGINS.top - MARGINS.bottom;


// create the frame of the scatterplot 
const SCATTER = d3.select("#scatterplot")
						.append("svg")
							.attr("height", FRAME)
							.attr("width", FRAME)
							.attr("class", "frame");


// build the scatterplot onto the canvas using the data in the given file 
function build_scatter() {
	// read data from the file 
	d3.csv("data/scatter-data.csv").then((data) => {

		// adjust the data to the pixels of the canvas 
		// since number above 10 connot be inputed this number is hardcoded
		const X_MAX = 10
		const X_SCALE = d3.scaleLinear()
							.domain([0, X_MAX])
							.range([0, VIS]);

		// adjust the data according to the pixels of the canvas 
		// since numbers above 10 cannot eb inputted this number is hardcoded 
		const Y_MAX = 10 
		const Y_SCALE = d3.scaleLinear()
							.domain([0, Y_MAX])
							.range([VIS, 0]);

		// make the x_axis 
		SCATTER.append("g")
						.attr("transform", "translate(" + MARGINS.left + "," + (VIS + MARGINS.top) + ")")
						.call(d3.axisBottom(X_SCALE).ticks(10))
							.attr("font-size", "10px")

		
		// make the Y-axis 
		SCATTER.append("g")
						.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
						.call(d3.axisLeft(Y_SCALE).ticks(10))
							.attr("font-size", "10px");

		// append all the points that are read in from the file 
		SCATTER.selectAll("points")
						.data(data)
						.enter()
						.append("circle")
							.attr("id", (d) => {return "(" + d.x + "," + d.y + ")";})
							.attr("cx", (d) => {return (MARGINS.left + X_SCALE(d.x));})
							.attr("cy", (d) => {return (MARGINS.top + Y_SCALE(d.y));})
							.attr("r", 10)
							.attr("class", "point");

		
		// function which handles the selection of points 
		function selectPoint(point) {

			let ClickedPoint= document.getElementById(point.target.id);
    		let PointCoordinate = document.getElementById("clicked_coordinates");
    		if (ClickedPoint.classList.contains("selected")) {
				ClickedPoint.classList.remove("selected");
       			PointCoordinate.innerHTML = " ";
			}
			else {
				ClickedPoint.classList.add("selected");
        		PointCoordinate.innerHTML = "Last point clicked:" + point.target.id;
			}
		}

		
		// add the listener to all the points 
		SCATTER.selectAll(".point")
						.on("click", selectPoint);


		// function to read in the coordinates from the html element 
		function submitClicked() {
		    let xvals = document.getElementById("x"); 
		    let yvals = document.getElementById("y");
		    let xValue = xvals.options[xvals.selectedIndex].value;
    		let yValue = yvals.options[yvals.selectedIndex].value;
		    let newPoint = {"x": xValue, "y": yValue};
		    let newData = [newPoint];
		    SCATTER.selectAll("points")
						.data(newData)
						.enter()
						.append("circle")
							.attr("id", (d) => {return "(" + d.x + "," + d.y + ")";})
							.attr("cx", (d) => {return (MARGINS.left + X_SCALE(d.x));})
							.attr("cy", (d) => {return (MARGINS.top + Y_SCALE(d.y));})
							.attr("r", 10)
							.attr("class", "point")
			SCATTER.selectAll(".point")
						.on("click", selectPoint);
		}
		d3.select("#Butt").on("click", submitClicked);
	});
};
build_scatter();


// First, we need a frame
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom;

//Creating the frame -- bar chart plot
const FRAME2 = d3.select("#barchart") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");
//build interactive bar plot
function build_interactive_bar(){
  //opening file - scatter data 
d3.csv("data/bar-data.csv").then((data) => {
  //checking that the data is printing
  console.log(data);

  //define scale functions that maps the data
  //x-axis
  const X_SCALE2 = d3.scaleBand()
                      .domain(data.map(function(d) {return d.category; })) // set domain using map fnction for categories
                      .range([0,VIS_WIDTH])
                      .padding(0.4);
  //find Max X
  const MAX_X2 = d3.max(data, (d) => {return parseInt(d.amount);})
  const Y_SCALE2 = d3.scaleLinear()
                      .domain([0,MAX_X2+1])
                      .range([VIS_HEIGHT,0]);

  //add X_Scale and Y_Scale to plot bars
  FRAME2.selectAll("allBars")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("x", (d) => {return (MARGINS.left + X_SCALE2(d.category));})
        .attr("width",X_SCALE2.bandwidth())
        .attr("y", (d) => {return (MARGINS.top + Y_SCALE2(d.amount));})
        .attr("height",(d)=>{return (VIS_HEIGHT - Y_SCALE2(d.amount));})
        .attr("fill","blue");
  
  //Tooltip
  const TOOLTIP = d3.select(("#barchart"))
                      .append("div")
                      .attr("class","tooltip")
                      .style("opacity",0);

  //event handler for Tooltip
  function handleMouseover(event,d){
    TOOLTIP.style("opacity",1);
  };
  function handleMousemove(event,d){
     TOOLTIP.html("Category: " + d.category + "<br>Value: " + d.amount)
     .style("left", (event.pageX + 10) + "px") //add offset
                                                 // from mouse
     .style("top", (event.pageY - 50) + "px"); 
  };
  function handleMouseleave(event,d){
    TOOLTIP.style("opacity",0);
  };
  //add event listeners
  FRAME2.selectAll(".bar")
        .on("mouseover", handleMouseover) //add event listeners
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave); 

	// add an xaxis to the vis
  FRAME2.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
     .call(d3.axisBottom(X_SCALE2).ticks())
    .attr("font-size", "15px");

  // add an yaxis to the vis
  FRAME2.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
    .call(d3.axisLeft(Y_SCALE2).ticks(10))
    .attr("font-size", "15px");
                    });


};
build_interactive_bar();

/*
// bar chart frame
const FRAME_BAR = d3.select("#barchart")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_HEIGHT)
						.attr("class", "frame");

// build interactive bar chart
function build_barchart() {
	d3.csv("data/bar-data.csv").then((data) => {

		// x-axis scaling
		const X_SCALE = d3.scaleBand()
							.domain(data.map((d) => {return d.category;}))	// map categories to be equally spaced on x-axis
							.range([0, VIS_HEIGHT])
							.padding(0.4);

		// y-axis scaling
		const MAX_VALUE_Y = d3.max(data, (d) => {return parseInt(d.amount);})
		const Y_SCALE = d3.scaleLinear()
							.domain([0, MAX_VALUE_Y + 1])
							.range([VIS_HEIGHT, 0]);	// range = [max, min] for numbers to start from bottom

		// add x-axis
		FRAME_BAR.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
					.call(d3.axisBottom(X_SCALE).ticks())
						.attr("font-size", "15px")

		// add y-axis
		FRAME_BAR.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
					.call(d3.axisLeft(Y_SCALE).ticks(10))
						.attr("font-size", "15px");

		// add bars for data
		FRAME_BAR.selectAll("bars")
					.data(data)
					.enter()
					.append("rect")
						.attr("x", (d) => {return (MARGINS.left + X_SCALE(d.category));})
						.attr("y", (d) => {return (MARGINS.top + Y_SCALE(d.amount));})
						.attr("width", X_SCALE.bandwidth())
						.attr("height", (d) => {return (VIS_HEIGHT - Y_SCALE(d.amount));})
						.attr("fill", "dodgerblue")
						.attr("class", "bar");

		// tooltip
		const TOOLTIP = d3.select(("#barchart"))
							.append("div")
								.attr("class", "tooltip")
								.style("opacity", 0);

		// on mouseover, make tooltip opaque
		function mouseover(event, d) {
			TOOLTIP.style("opacity", 1);
		};

		// position tooltip 
		function mousemove(event, d) {
			TOOLTIP.html("Name: " + d.category + "<br>Value: " + d.amount)
						.style("left", (event.pageX + 10) + "px")
						.style("top", (event.pageY - 50) + "px");
		};

		// on mouseover, make tooltip opaque
		function mouseleave(event, d) {
			TOOLTIP.style("opacity", 0);
		};

		// add event listeners to all of the bars
		FRAME_BAR.selectAll(".bar")
					.on("mouseover", mouseover)
					.on("mousemove", mousemove)
					.on("mouseleave", mouseleave);

	});
};
build_barchart();
*/