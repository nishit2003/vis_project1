
// // Scatterplot

// /**
//  * Load data from CSV file asynchronously and render scatter plot
//  */
// let data, scatterplot;
// d3.csv('data/national_health_data.csv')
//   .then(_data => {
//     data = _data;
//     data.forEach(d => {
//       d.poverty_perc = +d.poverty_perc;
//       d.percent_no_heath_insurance = +d.percent_no_heath_insurance;
//     });
    
//     scatterplot = new Scatterplot({ parentElement: '#scatterplot'}, data);
//     scatterplot.updateVis();
//   })
//   .catch(error => console.error(error));
  
// console.log('Scatterplot');


// class Scatterplot {

//    /**
//     * Class constructor with basic chart configuration
//     * @param {Object}
//     * @param {Array}
//     */
//    constructor(_config, _data) {
//      this.config = {
//        parentElement: _config.parentElement,
//        containerWidth: _config.containerWidth || 600,
//        containerHeight: _config.containerHeight || 400,
//        margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 35},
//        tooltipPadding: _config.tooltipPadding || 15
//      }
//      this.data = _data;w
//      this.initVis();
//    }
   
//    /**
//     * We initialize scales/axes and append static elements, such as axis titles.
//     */
//    initVis() {
//      let vis = this;
 
//      // Calculate inner chart size. Margin specifies the space around the actual chart.
//      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
//      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
 
//      // Initialize scales
//      vis.colorScale = d3.scaleOrdinal()
//          .range(['#d3eecd', '#7bc77e', '#2a8d46']) // light green to dark green
//          .domain(['Easy','Intermediate','Difficult']);
 
//      vis.xScale = d3.scaleLinear()
//          .range([0, vis.width]);
 
//      vis.yScale = d3.scaleLinear()
//          .range([vis.height, 0]);
 
//      // Initialize axes
//      vis.xAxis = d3.axisBottom(vis.xScale)
//          .ticks(6)
//          .tickSize(-vis.height - 10)
//          .tickPadding(10)
//          .tickFormat(d => d + ' km');
 
//      vis.yAxis = d3.axisLeft(vis.yScale)
//          .ticks(6)
//          .tickSize(-vis.width - 10)
//          .tickPadding(10);
 
//      // Define size of SVG drawing area
//      vis.svg = d3.select(vis.config.parentElement)
//          .attr('width', vis.config.containerWidth)
//          .attr('height', vis.config.containerHeight);
 
//      // Append group element that will contain our actual chart 
//      // and position it according to the given margin config
//      vis.chart = vis.svg.append('g')
//          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
 
//      // Append empty x-axis group and move it to the bottom of the chart
//      vis.xAxisG = vis.chart.append('g')
//          .attr('class', 'axis x-axis')
//          .attr('transform', `translate(0,${vis.height})`);
     
//      // Append y-axis group
//      vis.yAxisG = vis.chart.append('g')
//          .attr('class', 'axis y-axis');
 
//      // Append both axis titles
//      vis.chart.append('text')
//          .attr('class', 'axis-title')
//          .attr('y', vis.height - 15)
//          .attr('x', vis.width + 10)
//          .attr('dy', '.71em')
//          .style('text-anchor', 'end')
//          .text('Distance');
 
//      vis.svg.append('text')
//          .attr('class', 'axis-title')
//          .attr('x', 0)
//          .attr('y', 0)
//          .attr('dy', '.71em')
//          .text('Hours');
 
//      // Specificy accessor functions
//      vis.colorValue = d => d.difficulty;
//      vis.xValue = d => d.time;
//      vis.yValue = d => d.distance;
//    }
 
//    /**
//     * Prepare the data and scales before we render it.
//     */
//    updateVis() {
//      let vis = this;
     
//      // Set the scale input domains
//      vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
//      vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);
 
//      // Add circles
//      vis.circles = vis.chart.selectAll('.point')
//          .data(vis.data, d => d.trail)
//        .join('circle')
//          .attr('class', 'point')
//          .attr('r', 4)
//          .attr('cy', d => vis.yScale(vis.yValue(d)))
//          .attr('cx', d => vis.xScale(vis.xValue(d)))
//          .attr('fill', d => vis.colorScale(vis.colorValue(d)));
 
 
//      // Tooltip event listeners
//      vis.circles
//          .on('mouseover', (event,d) => {
//            d3.select('#tooltip')
//              .style('display', 'block')
//              .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
//              .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
//              .html(`
//                <div class="tooltip-title">${d.trail}</div>
//                <div><i>${d.region}</i></div>
//                <ul>
//                  <li>${d.distance} km, ~${d.time} hours</li>
//                  <li>${d.difficulty}</li>
//                  <li>${d.season}</li>
//                </ul>
//              `);
//          })
//          .on('mouseleave', () => {
//            d3.select('#tooltip').style('display', 'none');
//          });
     
//      // Update the axes/gridlines
//      // We use the second .call() to remove the axis and just show gridlines
//      vis.xAxisG
//          .call(vis.xAxis)
//          .call(g => g.select('.domain').remove());
 
//      vis.yAxisG
//          .call(vis.yAxis)
//          .call(g => g.select('.domain').remove())
//    }
 
//  }


// Load data from CSV file asynchronously
d3.csv('data/national_health_data.csv')
  .then(data => {
    // Filter out rows with value -1 for both variables
    data = data.filter(d => d.poverty_perc !== -1 && d.percent_no_heath_insurance !== -1);

    // Convert string values to numbers
    data.forEach(d => {
      d.poverty_perc = +d.poverty_perc;
      d.percent_no_heath_insurance = +d.percent_no_heath_insurance;
    });

    // Initialize the scatterplot
    initScatterplot(data);
  })
  .catch(error => console.error(error));

// Function to initialize the scatterplot
function initScatterplot(data) {
  const margin = { top: 20, right: 20, bottom: 40, left: 100 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG container
  const svg = d3.select('#scatterplot')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Set up scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.percent_no_heath_insurance)])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty_perc)])
    .range([height, 0]);

  // Add circles
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.percent_no_heath_insurance))
    .attr('cy', d => yScale(d.poverty_perc))
    .attr('r', 4)
    .style('fill', 'steelblue');

  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(yScale));

  // Add X axis label
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom)
    .text('Percent No Health Insurance');

  // Add Y axis label
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', margin.left-140)
    .text('Poverty Percentage');
}
