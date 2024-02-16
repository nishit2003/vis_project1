class Scatterplot {

   /**
    * Class constructor with basic chart configuration
    * @param {Object}
    * @param {Array}
    */
   constructor(_config, _data) {
     this.config = {
       parentElement: _config.parentElement,
       containerWidth: _config.containerWidth || 600,
       containerHeight: _config.containerHeight || 400,
       margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 35},
       tooltipPadding: _config.tooltipPadding || 15
     }
     this.data = _data;
     this.initVis();
   }

   initVis(){
      let vis = this;
      
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
   
      // Initialize scales
    vis.colorScale = d3.scaleOrdinal()
    .range(['#BFEFFF', '#87CEEB', '#4682B4', '#1E90FF']) 
    .domain(['Rural','Small_CIty','Suburban','Urban']);

   vis.xScale = d3.scaleLinear()
    .range([0, vis.width]);

   vis.yScale = d3.scaleLinear()
    .range([vis.height, 0]);

// Initialize axes
   vis.xAxis = d3.axisBottom(vis.xScale)
    .ticks(6)
    .tickSize(-vis.height - 10)
    .tickPadding(10)
    .tickFormat(d => d + '%');

   vis.yAxis = d3.axisLeft(vis.yScale)
    .ticks(6)
    .tickSize(-vis.width - 10)
    .tickPadding(10);

// Define size of SVG drawing area
   vis.svg = d3.select(vis.config.parentElement)
    .attr('width', vis.config.containerWidth)
    .attr('height', vis.config.containerHeight);

   

   // Append group element that will contain our actual chart 
    // and position it according to the given margin config
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // Append both axis titles
    vis.chart.append('text')
        .attr('class', 'axis-title')
        .attr('y', vis.height - 15)
        .attr('x', vis.width + 10)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('People without Health Insurance (%)');

    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '.71em')
        .text('Poverty (%)');

    // Specificy accessor functions
    vis.colorValue = d => d.urban_rural_status;
    vis.xValue = d => d.poverty_perc;
    vis.yValue = d => d.percent_no_heath_insurance;

   }

   /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
   let vis = this;
   
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
            //  <div><i>${d.region}</i></div>
             <ul>
               <li>${d.percent_no_heath_insurance} km, ~${d.poverty_perc} hours</li>
               <li>${d.urban_rural_status}</li>
               // <li>${d.season}</li>
             </ul>
           `);
       })
       .on('mouseleave', () => {
         d3.select('#tooltip').style('display', 'none');
       });
   
   // Update the axes/gridlines
   // We use the second .call() to remove the axis and just show gridlines
   vis.xAxisG
       .call(vis.xAxis)
       .call(g => g.select('.domain').remove());

   vis.yAxisG
       .call(vis.yAxis)
       .call(g => g.select('.domain').remove())
 }
}