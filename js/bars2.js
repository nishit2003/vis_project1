// set the dimensions and margins of the graph
const margin1 = {top: 60, right:0, bottom: 50, left: 40};
const width2 = 470 - margin1.left - margin1.right;
const height1 = 550 - margin1.top - margin1.bottom;

// append the svg1 object to the body of the page
const svg1 = d3.select("#histogram2")
  .append("svg")
    .attr("width", 470)
    .attr("height", 550)
    .attr("viewBox", "0 0 470 550")
   //  .attr("preserveAspectRatio", "xMinYMin")
  .append("g")
    .attr("transform", `translate(${margin1.left}, ${margin1.top})`);

// parse the Data
d3.csv("data/national_health_data.csv")
.then(function(data){

   data = data.filter(d => d.percent_no_heath_insurance !== -1);

   data.forEach(function(d) {
      d.percent_no_heath_insurance = +d.percent_no_heath_insurance;
  });


// X scale and Axis
const xScale = d3.scaleLinear()
.domain(d3.extent(data, d => d.percent_no_heath_insurance))
.range([0, width2]);
svg1
svg1.append('g')
.attr("transform", `translate(0, ${height1})`)
.call(d3.axisBottom(xScale)
  .tickValues(d3.range(0,41, 2)) 
  .tickSize(0)
  .tickPadding(8) );


  const maxPovertyPerc = d3.max(data, d => d.percent_no_heath_insurance);

// Y scale and Axis
const yScale = d3.scaleLinear()
    .range([height1, 0])
    .domain([0, maxPovertyPerc]);  


const yAxis = svg1.append('g')

// set horizontal grid line
const GridLine = () => d3.axisLeft().scale(yScale);
svg1
  .append("g")
    .attr("class", "grid")
  .call(GridLine()
    .tickSize(-width2,0,0)
    .tickFormat("")
    .ticks(10)
);

// create a tooltip
const tooltip = d3.select("body")
  .append("div")
    .attr("class", "tooltip");

// tooltip events
const mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "#EF4A60")
      .style("opacity", .5)
};
const mousemove = function(event,d) {
    tooltip
    .html(`<b>Number of counties</b>: ${d.length}`)
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px")
};
const mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
};

// set the parameters for the histogram
const histogram = d3.bin()
  .value(d => d.percent_no_heath_insurance)
  .domain(xScale.domain())
  .thresholds(xScale.ticks(50));

// prepare data for bars
const bins = histogram(data)

// Scale the range of the data in the y domain
yScale.domain([0, 170]);
// yScale.domain([0, d3.max(bins, d => d.length)]);


// add the y Axis
yAxis
  .call(d3.axisLeft(yScale).tickSize(0).tickPadding(4))
  .call(d => d.select(".domain").remove());

// append the bar rectangles to the svg1 element
svg1
  .selectAll("rect")
    .data(bins)
  .join("rect")
    .attr("class", "bar")
   //  .attr("x", 1)
    .attr("transform", d => `translate(${xScale(d.x0)}, ${yScale(d.length)})`)
    .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
    .attr("height", d => height1 - yScale(d.length))
    .style("fill", "#0072BC")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

// set title
svg1
  .append("text")
    .attr("class", "chart-title")
    .attr("x", -(margin1.left)*0.4)
    .attr("y", -(margin1.top)/1.5)
    .attr("text-anchor", "start")
  .text("People Without Health Insurance Distribution")

// set X axis label
svg1
  .append("text")
    .attr("class", "chart-label")
    .attr("x", width2/2)
    .attr("y", height1+margin1.bottom/1.7)
    .attr("text-anchor", "middle")
  .text("People without Health Insurance (%)");

// set Y axis label
svg1
  .append("text")
    .attr("class", "chart-label")
    .attr("x", -(margin1.left)*0.4)
    .attr("y", -(margin1.top/5))
    .attr("text-anchor", "start")
  .text("Number of Counties")

})