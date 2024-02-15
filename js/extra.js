
// d3.csv('data/national_health_data.csv')
//           .then(data => {
//              console.log('Data loading complete. Work with dataset.');
       
//              data = data.filter(d => d.percent_no_heath_insurance !== -1);
       
//                // Convert sales strings to numbers
//              data.forEach(d => {
//                d.percent_no_heath_insurance = +d.percent_no_heath_insurance;
//                d.poverty_perc = +d.poverty_perc;
//                d.number_of_hospitals = +d.number_of_hospitals;
       
//              });
       
//              showBarChart(data);
//           })
//            .catch(function (error) {
//                  console.error('Error loading the data');
//               });

/*
 *  Draw chart
 */
// function showBarChart(data) {
// 	const width = 500;
// 	const height = 120;

// 	// Append empty SVG container and set size
// 	const svg = d3.select('#chart').append('svg')
// 	  .attr('width', width)
// 	  .attr('height', height);

// 	// Initialize linear and ordinal scales (input domain and output range)
// 	const xScale = d3.scaleLinear()
// 	  .domain([0, d3.max(data, d => d.percent_no_heath_insurance)]) //max from sales field in the objects in the data array
// 	  .range([0, width]); 

// 	const yScale = d3.scaleBand()
// 	  .domain(data.map(d => d.poverty_perc)) //list of the month field in the objects in the data array
// 	  .range([0, height])
// 	  .paddingInner(0.1);

// 	// Initialize axes
// 	const xAxis = d3.axisBottom(xScale);
// 	const yAxis = d3.axisLeft(yScale);

// 	// Draw the axis
// 	const xAxisGroup = svg.append('g')
// 	  .attr('class', 'axis x-axis') 
// 	  .call(xAxis);

// 	const yAxisGroup = svg.append('g')
// 	  .attr('class', 'axis y-axis')
// 	  .call(yAxis);

// 	// Add rectangles
// 	const bars = svg.selectAll('rect')
// 	  .data(data)
// 	  .enter()
// 	.append('rect')
// 	  .attr('class', 'bar')
// 	  .attr('fill', 'steelblue')
// 	  .attr('width', d => xScale(d.percent_no_heath_insurance))
// 	  .attr('height', yScale.bandwidth())
// 	  .attr('y', d => yScale(d.poverty_perc))
// 	  .attr('x', 0);
// }


// function showBarChart(data) {
// 	// Margin object with properties for the four directions
// 	const margin = {top: 5, right: 5, bottom: 20, left: 50};

// 	// Width and height as the inner dimensions of the chart area
// 	const width = 900 - margin.left - margin.right,
// 	height = 100 - margin.top - margin.bottom;

// 	// Define 'svg' as a child-element (g) from the drawing area and include spaces
// 	const svg = d3.select('#chart').append('svg')
// 		.attr('width', width + margin.left + margin.right)
// 		.attr('height', height + margin.top + margin.bottom)
// 		.append('g')
// 		.attr('transform', `translate(${margin.left}, ${margin.top})`);

// 	// All subsequent functions/properties can basically ignore the margins

// 	// Initialize linear and ordinal scales (input domain and output range)
// 	const xScale = d3.scaleLinear()
// 		.domain([0, d3.max(data, d => d.number_of_hospitals)])
// 		.range([0, width]);

// 	const yScale = d3.scaleBand()
// 		.domain(data.map(d => d.urban_rural_status))
// 		.range([0, height])
// 		.paddingInner(0.15);

// 	// Initialize axes
// 	const xAxis = d3.axisBottom(xScale)
// 		.ticks(6)
// 		.tickSizeOuter(0);

// 	const yAxis = d3.axisLeft(yScale)
// 		.tickSizeOuter(0);

// 	// Draw the axis (move xAxis to the bottom with 'translate')
// 	const xAxisGroup = svg.append('g')
// 		.attr('class', 'axis x-axis')
// 		.attr('transform', `translate(0, ${height})`)
// 		.call(xAxis);

// 	const yAxisGroup = svg.append('g')
// 		.attr('class', 'axis y-axis')
// 		.call(yAxis);

// 	// Add rectangles
// 	svg.selectAll('rect')
// 		.data(data)
// 		.enter()
// 	  .append('rect')
// 		.attr('class', 'bar')
// 		.attr('width', d => xScale(d.number_of_hospitals))
// 		.attr('height', yScale.bandwidth())
// 		.attr('y', d => yScale(d.urban_rural_status))
// 		.attr('x', 0);
// }


// set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 40},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#chart")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

//          d3.csv('data/national_health_data.csv')
//           .then(data => {
//              console.log('Data loading complete. Work with dataset.');
       
//              data = data.filter(d => d.percent_no_heath_insurance !== -1);
       
//                // Convert sales strings to numbers
//              data.forEach(d => {
//                d.percent_no_heath_insurance = +d.percent_no_heath_insurance;
//                d.poverty_perc = +d.poverty_perc;
       
//              });
       
//              showBarChart(data);
//           })
//            .catch(error => {
//                console.error('Error loading the data');


//           var x = d3.scaleLinear()
//           .domain([0, d3.max(data, function(d) { return +d.price })]) 
//           .range([0, width]);
//       svg.append("g")
//           .attr("transform", "translate(0," + height + ")")
//           .call(d3.axisBottom(x));
          
//           var histogram = d3.histogram()
//       .value(function(d) { return d.percent_no_heath_insurance; })   
//       .domain(x.domain())  
//       .thresholds(x.ticks(70));

//       var bins = histogram(data);

//       // Y axis: scale and draw:
//       var y = d3.scaleLinear()
//           .range([height, 0]);
//           y.domain([0, d3.max(bins, function(d) { return d.poverty_perc; })]);  
//       svg.append("g")
//           .call(d3.axisLeft(y));
    
//       // append the bar rectangles to the svg element
//       svg.selectAll("rect")
//           .data(bins)
//           .enter()
//           .append("rect")
//             .attr("x", 1)
//             .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
//             .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
//             .attr("height", function(d) { return height - y(d.length); })
//             .style("fill", "#69b3a2")
    
//     });


// // Updating header text

// document.addEventListener('DOMContentLoaded', function() {
//    const form = document.querySelector('form');
//    const visualizationContainer = document.querySelector('.visualization-container');

//    function updateHeaderText(attribute1, attribute2, graphType) {
//        const header = document.querySelector('header h1');
//        header.textContent = `US Health Dashboard - ${attribute1} vs ${attribute2} (${graphType})`;
//    }
// // *********************************************

//    // Function to draw the bar graph
//    function drawBarGraph(data) {
//        visualizationContainer.innerHTML = '';

//        // Set up SVG dimensions
//        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
//        const width = 600 - margin.left - margin.right;
//        const height = 400 - margin.top - margin.bottom;

//        // Append SVG to the visualization container
//        const svg = d3.select('.visualization-container').append('svg')
//            .attr('width', width + margin.left + margin.right)
//            .attr('height', height + margin.top + margin.bottom)
//            .append('g')
//            .attr('transform', `translate(${margin.left},${margin.top})`);

//        // Extract the values from the data
//        const values = data.map(d => d.value);

//        // Set up scales
//        const x = d3.scaleBand()
//            .domain(data.map(d => d.label))
//            .range([0, width])
//            .padding(0.1);

//        const y = d3.scaleLinear()
//            .domain([0, d3.max(values)])
//            .nice()
//            .range([height, 0]);

//        // Draw bars
//        svg.selectAll('.bar')
//            .data(data)
//            .enter().append('rect')
//            .attr('class', 'bar')
//            .attr('x', d => x(d.label))
//            .attr('y', d => y(d.value))
//            .attr('width', x.bandwidth())
//            .attr('height', d => isNaN(d.value) ? 0 : height - y(d.value)); // Handle invalid values

//        // Draw x-axis
//        svg.append('g')
//            .attr('class', 'x-axis')
//            .attr('transform', `translate(0,${height})`)
//            .call(d3.axisBottom(x));

//        // Draw y-axis
//        svg.append('g')
//            .attr('class', 'y-axis')
//            .call(d3.axisLeft(y));
//    }

//    // Event listener for form submission
//    form.addEventListener('submit', function(event) {
//        event.preventDefault(); // Prevent form submission

//        // Get the selected attributes and graph type from the form
//        const attribute1 = document.getElementById('attributesSelect1').options[document.getElementById('attributesSelect1').selectedIndex].textContent;
//        const attribute2 = document.getElementById('attributesSelect2').options[document.getElementById('attributesSelect2').selectedIndex].textContent;
//        const graphType = document.getElementById('graph-type').value;

//        // Update the header text
//        updateHeaderText(attribute1, attribute2, graphType);

//        // Fetch data from CSV file
//        d3.csv('data/national_health_data.csv')
//            .then(data => {
//                // Convert data types if necessary
//                data.forEach(d => {
//                    // Convert to appropriate data types
//                    if (d.value === '-1') {
//                        d.value = NaN; // or replace with a default value
//                    } else {
//                        d.value = +d.value; // Convert to number
//                    }
//                });

//                // Draw the bar graph if the graph type is "bargraph"
//                if (graphType === 'bargraph') {
//                    drawBarGraph(data);
//                }
//            })
//            .catch(error => {
//                console.error('Error loading data:', error);
//            });
//    });
// });

// // *********************************************

// document.addEventListener('DOMContentLoaded', function() {
//    const form = document.querySelector('form');
//    const visualizationContainer = document.querySelector('.visualization-container');
//    let scatterplot;

//    function updateHeaderText(attribute1, attribute2, graphType) {
//        const header = document.querySelector('header h1');
//        header.textContent = `US Health Dashboard - ${attribute1} vs ${attribute2} (${graphType})`;
//    }

//    form.addEventListener('submit', function(event) {
//        event.preventDefault();

//        const attribute1 = document.getElementById('attributesSelect1').options[document.getElementById('attributesSelect1').selectedIndex].textContent;
//        const attribute2 = document.getElementById('attributesSelect2').options[document.getElementById('attributesSelect2').selectedIndex].textContent;
//        const graphType = document.getElementById('graph-type').value;

//        updateHeaderText(attribute1, attribute2, graphType);

//        d3.csv('data/national_health_data.csv')
//            .then(data => {
//                if (graphType === 'scatterplot') {
//                    // Filter data based on selected attributes
//                    const filteredData = data.map(d => ({ attribute1: d[attribute1], attribute2: d[attribute2] }));
//                    drawScatterplot(filteredData);
//                }
//            })
//            .catch(error => {
//                console.error('Error loading data:', error);
//            });
//    });

//    function drawScatterplot(data, attribute1, attribute2) {
//        visualizationContainer.innerHTML = '';

//        const margin = { top: 20, right: 20, bottom: 50, left: 60 };
//        const width = 600 - margin.left - margin.right;
//        const height = 400 - margin.top - margin.bottom;

//        const svg = d3.select('.visualization-container').append('svg')
//            .attr('width', width + margin.left + margin.right)
//            .attr('height', height + margin.top + margin.bottom)
//            .append('g')
//            .attr('transform', `translate(${margin.left},${margin.top})`);

//        const xScale = d3.scaleLinear()
//            .domain([0, d3.max(data, d => d.attribute1)])
//            .range([0, width]);

//        const yScale = d3.scaleLinear()
//            .domain([0, d3.max(data, d => d.attribute2)])
//            .range([height, 0]);

//        svg.selectAll('.dot')
//            .data(data)
//            .enter().append('circle')
//            .attr('class', 'dot')
//            .attr('cx', d => xScale(d.attribute1))
//            .attr('cy', d => yScale(d.attribute2))
//            .attr('r', 4);

//        // X-axis
//        svg.append('g')
//            .attr('transform', `translate(0, ${height})`)
//            .call(d3.axisBottom(xScale))
//            .append('text')
//            .attr('class', 'label')
//            .attr('x', width)
//            .attr('y', -6)
//            .style('text-anchor', 'end')
//            .text(attribute1);

//        // Y-axis
//        svg.append('g')
//            .call(d3.axisLeft(yScale))
//            .append('text')
//            .attr('class', 'label')
//            .attr('transform', 'rotate(-90)')
//            .attr('y', 6)
//            .attr('dy', '.71em')
//            .style('text-anchor', 'end')
//            .text(attribute2);
//    }
// });



// <div class="row">
// 					<div class="col-25">
// 						<label for="graph-type">Select Graph Type:</label>
// 					</div>
// 					<div class="col-75">
// 						<select id="graph-type">
// 							<option value="Distribution">Distribution</option>
// 							<option value="Correlation">Correlation</option>
// 							<option value="Spatial_Distribution">Spatial Distribution</option>
// 						</select>
// 					</div>
// 				</div>