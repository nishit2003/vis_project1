// Updating header text

document.addEventListener('DOMContentLoaded', function() {
   const form = document.querySelector('form');
   const visualizationContainer = document.querySelector('.visualization-container');

   function updateHeaderText(attribute1, attribute2, graphType) {
       const header = document.querySelector('header h1');
       header.textContent = `US Health Dashboard - ${attribute1} vs ${attribute2} (${graphType})`;
   }
// *********************************************

   // Function to draw the bar graph
   function drawBarGraph(data) {
       visualizationContainer.innerHTML = '';

       // Set up SVG dimensions
       const margin = { top: 20, right: 20, bottom: 30, left: 40 };
       const width = 600 - margin.left - margin.right;
       const height = 400 - margin.top - margin.bottom;

       // Append SVG to the visualization container
       const svg = d3.select('.visualization-container').append('svg')
           .attr('width', width + margin.left + margin.right)
           .attr('height', height + margin.top + margin.bottom)
           .append('g')
           .attr('transform', `translate(${margin.left},${margin.top})`);

       // Extract the values from the data
       const values = data.map(d => d.value);

       // Set up scales
       const x = d3.scaleBand()
           .domain(data.map(d => d.label))
           .range([0, width])
           .padding(0.1);

       const y = d3.scaleLinear()
           .domain([0, d3.max(values)])
           .nice()
           .range([height, 0]);

       // Draw bars
       svg.selectAll('.bar')
           .data(data)
           .enter().append('rect')
           .attr('class', 'bar')
           .attr('x', d => x(d.label))
           .attr('y', d => y(d.value))
           .attr('width', x.bandwidth())
           .attr('height', d => isNaN(d.value) ? 0 : height - y(d.value)); // Handle invalid values

       // Draw x-axis
       svg.append('g')
           .attr('class', 'x-axis')
           .attr('transform', `translate(0,${height})`)
           .call(d3.axisBottom(x));

       // Draw y-axis
       svg.append('g')
           .attr('class', 'y-axis')
           .call(d3.axisLeft(y));
   }

   // Event listener for form submission
   form.addEventListener('submit', function(event) {
       event.preventDefault(); // Prevent form submission

       // Get the selected attributes and graph type from the form
       const attribute1 = document.getElementById('attributesSelect1').options[document.getElementById('attributesSelect1').selectedIndex].textContent;
       const attribute2 = document.getElementById('attributesSelect2').options[document.getElementById('attributesSelect2').selectedIndex].textContent;
       const graphType = document.getElementById('graph-type').value;

       // Update the header text
       updateHeaderText(attribute1, attribute2, graphType);

       // Fetch data from CSV file
       d3.csv('data/national_health_data.csv')
           .then(data => {
               // Convert data types if necessary
               data.forEach(d => {
                   // Convert to appropriate data types
                   if (d.value === '-1') {
                       d.value = NaN; // or replace with a default value
                   } else {
                       d.value = +d.value; // Convert to number
                   }
               });

               // Draw the bar graph if the graph type is "bargraph"
               if (graphType === 'bargraph') {
                   drawBarGraph(data);
               }
           })
           .catch(error => {
               console.error('Error loading data:', error);
           });
   });
});

// *********************************************

document.addEventListener('DOMContentLoaded', function() {
   const form = document.querySelector('form');
   const visualizationContainer = document.querySelector('.visualization-container');
   let scatterplot;

   function updateHeaderText(attribute1, attribute2, graphType) {
       const header = document.querySelector('header h1');
       header.textContent = `US Health Dashboard - ${attribute1} vs ${attribute2} (${graphType})`;
   }

   form.addEventListener('submit', function(event) {
       event.preventDefault();

       const attribute1 = document.getElementById('attributesSelect1').options[document.getElementById('attributesSelect1').selectedIndex].textContent;
       const attribute2 = document.getElementById('attributesSelect2').options[document.getElementById('attributesSelect2').selectedIndex].textContent;
       const graphType = document.getElementById('graph-type').value;

       updateHeaderText(attribute1, attribute2, graphType);

       d3.csv('data/national_health_data.csv')
           .then(data => {
               if (graphType === 'scatterplot') {
                   // Filter data based on selected attributes
                   const filteredData = data.map(d => ({ attribute1: d[attribute1], attribute2: d[attribute2] }));
                   drawScatterplot(filteredData);
               }
           })
           .catch(error => {
               console.error('Error loading data:', error);
           });
   });

   function drawScatterplot(data, attribute1, attribute2) {
       visualizationContainer.innerHTML = '';

       const margin = { top: 20, right: 20, bottom: 50, left: 60 };
       const width = 600 - margin.left - margin.right;
       const height = 400 - margin.top - margin.bottom;

       const svg = d3.select('.visualization-container').append('svg')
           .attr('width', width + margin.left + margin.right)
           .attr('height', height + margin.top + margin.bottom)
           .append('g')
           .attr('transform', `translate(${margin.left},${margin.top})`);

       const xScale = d3.scaleLinear()
           .domain([0, d3.max(data, d => d.attribute1)])
           .range([0, width]);

       const yScale = d3.scaleLinear()
           .domain([0, d3.max(data, d => d.attribute2)])
           .range([height, 0]);

       svg.selectAll('.dot')
           .data(data)
           .enter().append('circle')
           .attr('class', 'dot')
           .attr('cx', d => xScale(d.attribute1))
           .attr('cy', d => yScale(d.attribute2))
           .attr('r', 4);

       // X-axis
       svg.append('g')
           .attr('transform', `translate(0, ${height})`)
           .call(d3.axisBottom(xScale))
           .append('text')
           .attr('class', 'label')
           .attr('x', width)
           .attr('y', -6)
           .style('text-anchor', 'end')
           .text(attribute1);

       // Y-axis
       svg.append('g')
           .call(d3.axisLeft(yScale))
           .append('text')
           .attr('class', 'label')
           .attr('transform', 'rotate(-90)')
           .attr('y', 6)
           .attr('dy', '.71em')
           .style('text-anchor', 'end')
           .text(attribute2);
   }
});
