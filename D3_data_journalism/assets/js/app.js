// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define chart margins
var margin = {
  top: 40,
  right: 80,
  bottom: 60,
  left: 50
};

// Define dimensions of chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from csv file
d3.csv("assets/data/data.csv").then(function (censusData) {
  // console.log(censusData);

  // Parse data, cast as numbers
  censusData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(censusData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([4, d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //  Append axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Create circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "18")
    .attr("class", "stateCircle")
    .attr("opacity", "1");

  // chartGroup.append("text")
  //   .attr("x", function (d) { return d.cx; })
  //   .attr("y", function (d) { return d.cy; })
  //   .attr("class", "stateText")
  //   .style("font-size", d => d.radius * 0.4 + "px")
  //   .text(d => d.abbr);

  // Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

  // Create tool tip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide tool tip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 0)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 0})`)
    .attr("class", "aText")
    .text("In Poverty (%)");


}).catch(function (error) {
  console.log(error);
});


