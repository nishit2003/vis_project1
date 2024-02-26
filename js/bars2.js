
class Histogram2 {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 550,
      margin: _config.margin || {top: 50, right: 20, bottom: 50, left: 35},
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.data = _data;
    this.initVis();
  }


  initVis(){
    let vis = this;
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
// Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
    .append('svg')
    .attr('width', vis.config.containerWidth)
    .attr('height', vis.config.containerHeight)
    .append('g')
    .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);


  // X scale and Axis
vis.xScale = d3.scaleLinear()
.domain([0,50])
.range([0, vis.width]);

vis.svg.append('g')
.attr("transform", `translate(0, ${vis.height})`)
.call(d3.axisBottom(vis.xScale)
  .tickValues(d3.range(0, 48, 2)) 
  .tickSize(0)
  .tickPadding(8) );


  // Y scale and Axis
 vis.yScale = d3.scaleLinear()
      .range([vis.height, 0])
      .domain([0, 375]);
      
  vis.yAxis = vis.svg.append('g')
  vis.yAxis
  .call(d3.axisLeft(vis.yScale).tickSize(0).tickPadding(4))
  .call(d => d.select(".domain").remove());

const GridLine = () => d3.axisLeft().scale(vis.yScale);
vis.svg
  .append("g")
    .attr("class", "grid")
  .call(GridLine()
    .tickSize(-vis.width,0,0)
    .tickFormat("")
    .ticks(10))
    .selectAll("line")
  .style("opacity", 0.35);;

  // set Y axis label
vis.svg
.append("text")
  .attr("class", "chart-labe")
  .attr("x", -(vis.config.margin.left)*0.4)
  .attr("y", -(vis.config.margin.top/5))
  .attr("text-anchor", "start")
.text("Number of Counties")

}

   updateVis(attribute2){
      let vis = this;

      vis.svg.selectAll(".chart-label").remove();

      // set X axis label
      vis.svg
         .append("text")
            .attr("class", "chart-label")
            .attr("x", vis.width/2)
            .attr("y", vis.height+vis.config.margin.bottom/1.7)
            .attr("text-anchor", "middle")
         .text(attributeNames1[attribute2]);

      const tooltip = d3.select("body")
         .append("div")
            .attr("class", "tooltip");

// tooltip events
const mouseover = function() {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "#EF4A60")
      .style("opacity", .5)
};

const mousemove = function(event,d) {
  tooltip
  d3.select('#tooltip_map')
  .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
  .html(`<b>Number of counties</b>: ${d.length}`)
    .style("top", event.pageY - 10 + "px")
    .style("left", event.pageX + 10 + "px")
};

const mouseleave = function() {
tooltip.style("opacity", 0);
d3.select('#tooltip_map').style('display', 'none');
d3.select(this)
  .style("stroke", "none")
  .style("opacity", 1);
};

// set the parameters for the histogram
const histogram = d3.bin()
  .value(d => d[attribute2])
  .domain(vis.xScale.domain())
  .thresholds(vis.xScale.ticks(50));

// prepare data for bars
const bins = histogram(data)


// append the bar rectangles to the svg element
vis.svg
  .selectAll("rect")
    .data(bins)
  .join("rect")
    .attr("class", "bar")
    .attr("x", 1)
    .attr("transform", d => `translate(${vis.xScale(d.x0)}, ${vis.yScale(d.length)})`)
    .attr("width", d => Math.max(0, vis.xScale(d.x1) - vis.xScale(d.x0) - 1))
    .attr("height", d => vis.height - vis.yScale(d.length))
    .style("fill", "#0172BC")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove) 
  .on("mouseleave", mouseleave);

   }

   
}



