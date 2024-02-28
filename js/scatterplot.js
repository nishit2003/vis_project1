class Scatterplot {

   /**
    * Class constructor with basic chart configuration
    * @param {Object}
    * @param {Array}
    */
   constructor(_config, _data, _choroplethMap) {
     this.config = {
       parentElement: _config.parentElement,
       containerWidth: _config.containerWidth || 1300,
       containerHeight: _config.containerHeight || 700,
       margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 35},
       tooltipPadding: _config.tooltipPadding || 1
     }
     this.data = _data;
     this.choroplethMap = _choroplethMap; // Pass an instance of ChoroplethMap

     this.initVis();
   }

   initVis(){
      let vis = this;
      // console.log(d3.min(vis.data, d => d[attribute1]));
      
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
   
      // Initialize scales
    vis.colorScale = d3.scaleOrdinal()
    .range(['#BFEFFF', '#87CEEB', '#1E90FF', '#4682B4']) 
    .domain(['Rural','Small_CIty','Suburban','Urban']);

    vis.xScale = d3
      .scaleLinear()
      .range([0, vis.width])
      .domain([
        d3.min(vis.data, (d) => +d[attribute1]),
        d3.max(vis.data, (d) => +d[attribute1]),
      ])
      .nice();

    vis.yScale = d3
      .scaleLinear()
      .range([vis.height, 0])
      .domain([
        d3.min(vis.data, (d) => +d[attribute2]),
        d3.max(vis.data, (d) => +d[attribute2]),
      ])
      .nice(); 

// Initialize axes
   vis.xAxis = d3.axisBottom(vis.xScale)
    .ticks(15)
    .tickSize(-vis.height - 10)
    .tickPadding(10)
    .tickFormat(d => d + '%');


   vis.yAxis = d3.axisLeft(vis.yScale)
    .ticks(10)
    .tickSize(-vis.width - 10)
    .tickPadding(10)
    .tickFormat(d => d + '%');



// Define size of SVG drawing area
   vis.svg = d3.select(vis.config.parentElement)
    .attr('width', vis.config.containerWidth)
    .attr('height', vis.config.containerHeight);

   
   // Append group element that will contain our actual chart 
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

// Initialize brush
vis.brush = d3.brush()
.extent([[0, 0], [vis.width, vis.height]])
.on("end", brushed);

// Append brush to the chart
vis.brushG = vis.chart.append("g")
.attr("class", "brush")
.call(vis.brush);

function brushed(event) {
if (event.selection) {
    // Get the selected circles
    const selectedCircles = vis.chart.selectAll('.point').filter(function (d) {
        const cx = vis.xScale(vis.xValue(d));
        const cy = vis.yScale(vis.yValue(d));
        return event.selection[0][0] <= cx && cx <= event.selection[1][0] &&
            event.selection[0][1] <= cy && cy <= event.selection[1][1];
    });

    // Log the selected circles
    // console.log(selectedCircles.data());

const selectedCountyIDs = selectedCircles.data().map(d => d.cnty_fips);
// console.log(selectedCountyIDs);

// Pass the selected county IDs to the method in the ChoroplethMap class
choroplethMap.highlightCounties(selectedCountyIDs);
choroplethMap2.highlightCounties(selectedCountyIDs);

// update histograph
// updateHistogram(selectedCountyIDs);
updateVis();
}
}

   }
   

  updateVis(attribute1,attribute2) {
   let vis = this;

    vis.chart.selectAll('.axis-title').remove();


  // Specificy accessor functions
  vis.colorValue = d => d.urban_rural_status;
  vis.xValue = d => +d[attribute1];
  vis.yValue = d => +d[attribute2];

  // Set the scale input domains
  vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
  vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

  // Add circles
  vis.circles = vis.chart.selectAll('.point')
      .data(vis.data, d => d.display_name)
    .join('circle')
      .attr('class', 'point')
      .attr('r', 4)
      .attr('cy', d => vis.yScale(vis.yValue(d)))
      .attr('cx', d => vis.xScale(vis.xValue(d)))
      .attr('fill', d => vis.colorScale(vis.colorValue(d)));


  // Tooltip event listeners
  vis.circles
      .on('mouseover', (event,d) => {
        d3.select('#tooltip')
          .style('display', 'block')
          .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
          .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
          .html(`
            <div class="tooltip-title">${d.display_name}</div>
            <div><i> Median Income : ${d.median_household_income}</i></div>
            <ul>
              <li> ${attributeNames1[attribute1]} : ${d[attribute1]} %</li>
              <li> ${attributeNames1[attribute2]} ${d[attribute2]} %</li>
            </ul>
          `);
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      });
  
  

   

   // Append both axis titles
   vis.chart.append('text')
   .attr('class', 'axis-title')
   .attr('y', vis.height - 15)
   .attr('x', vis.width + 10)
   .attr('dy', '.71em')
   .style('text-anchor', 'end')
   .text(attributeNames1[attribute2]);

vis.chart.append('text')
   .attr('class', 'axis-title')
   .attr('x', 0)
   .attr('y', 0)
   .attr('dy', '.71em')
   .text(attributeNames1[attribute1]);
   
   // Update the axes/gridlines
  vis.xAxisG
  .call(vis.xAxis)
  .call(g => g.select('.domain').remove());

vis.yAxisG
  .call(vis.yAxis)
  .call(g => g.select('.domain').remove())

 }
}


 