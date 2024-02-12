// Sample attributes array (replace this with your actual attributes)
const attributes = [
   "poverty_perc",
   "median_household_income",
   "education_less_than_high_school_percent",
   "air_quality",
   "park_access",
   "percent_inactive",
   "percent_smoking",
   "urban_rural_status",
   "elderly_percentage",
   "number_of_hospitals",
   "number_of_primary_care_physicians",
   "percent_no_heath_insurance",
   "percent_high_blood_pressure",
   "percent_coronary_heart_disease",
   "percent_stroke",
   "percent_high_cholesterol"
];

// Function to populate attribute dropdowns
function populateAttributeDropdowns() {
   const attributeDropdowns = document.querySelectorAll('.controls select');
   attributeDropdowns.forEach(dropdown => {
       attributes.forEach(attribute => {
           const option = document.createElement('option');
           option.value = attribute;
           option.textContent = attribute.replace(/_/g, ' '); // Replace underscores with spaces
           dropdown.appendChild(option);
       });
   });
}

// Populate attribute dropdowns on page load
populateAttributeDropdowns();







// Function to update the bar graph based on selected attributes
function updateBarGraph(attribute1Data, attribute2Data) {
   const barGraph = d3.select('#bar-graph');
   barGraph.html(''); // Clear previous bars

   // Create bars for attribute 1
   const bar1 = barGraph.selectAll('.bar')
       .data(attribute1Data)
       .enter()
       .append('div')
       .attr('class', 'bar')
       .style('height', d => d + 'px')
       .attr('title', d => 'Value: ' + d);
       
   bar1.append('div')
       .attr('class', 'bar-label')
       .text((d, i) => 'County ' + (i + 1));

   // Create bars for attribute 2 (if needed)
   if (attribute2Data) {
       const bar2 = barGraph.selectAll('.bar2')
           .data(attribute2Data)
           .enter()
           .append('div')
           .attr('class', 'bar')
           .style('height', d => d + 'px')
           .attr('title', d => 'Value: ' + d);
           
       bar2.append('div')
           .attr('class', 'bar-label')
           .text((d, i) => 'County ' + (i + 1));
   }
}

// Function to handle submit button click
function handleSubmit() {
   const attribute1 = document.getElementById('attribute1').value;
   const attribute2 = document.getElementById('attribute2').value;
   
   // Fetch CSV data and update bar graph
   d3.csv('data/national_health_data.csv')
       .then(data => {
           // Extract data for selected attributes
           const attribute1Data = data.map(d => parseFloat(d[attribute1]));
           const attribute2Data = attribute2 ? data.map(d => parseFloat(d[attribute2])) : null;
           
           // Update bar graph with selected attributes
           updateBarGraph(attribute1Data, attribute2Data);
       })
       .catch(error => console.error('Error fetching CSV data:', error));
}

// Add event listener to submit button
const submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener('click', handleSubmit);
