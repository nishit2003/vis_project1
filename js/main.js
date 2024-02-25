// global variables
let choroplethMap; 
let attributeNames;
let attribute1 = 'poverty_perc'; // Default attribute 1
let attribute2 = 'percent_no_heath_insurance'; // Default attribute 2
   
   document.getElementById('attributeForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form submission
    
      const attributeNames = {
         poverty_perc: 'Poverty Percentage',
         median_household_income: 'Median Household Income',
         education_less_than_high_school_percent: 'Education Less Than High School Percentage',
         air_quality: 'Air Quality',
         park_access: 'Park Access',
         percent_inactive: 'Percent Inactive',
         percent_smoking: 'Percent Smoking',
         urban_rural_status: 'Urban Rural Status',
         elderly_percentage: 'Elderly Percentage',
         number_of_hospitals: 'Number of Hospitals',
         number_of_primary_care_physicians: 'Number of Primary Care Physicians',
         percent_no_heath_insurance: 'Percent No Health Insurance',
         percent_high_blood_pressure: 'Percent High Blood Pressure',
         percent_coronary_heart_disease: 'Percent Coronary Heart Disease',
         percent_stroke: 'Percent Stroke',
         percent_high_cholesterol: 'Percent High Cholesterol',
     };
   
      // Get selected attribute values
      attribute1 = document.getElementById('attributesSelect1').value;
      attribute2 = document.getElementById('attributesSelect2').value;
    
      // Update header with selected attributes
      document.getElementById('dashboardTitle').textContent = `US Health Dashboard - ${attributeNames[attribute1]} vs ${attributeNames[attribute2]}`;
      updateGraphs(attribute1, attribute2);
    });

   
   function updateGraphs(attribute1, attribute2) {
   
      if (!attribute1 || !attribute2) {
        
         attribute1 = 'poverty_perc'; // Default attribute 1
         attribute2 = 'percent_no_heath_insurance'; // Default attribute 2
       }
       
      console.log(attribute1,attribute2);
   
      scatterplot.updateVis(attribute1, attribute2); // Update scatterplot
   
      choroplethMap.updateVis(attribute1); // Update choropleth map 1
      choroplethMap2.updateVis(attribute2); // Update choropleth map 2
      // barChart1.updateVis(attribute1); // Update bar chart 1
      // barChart2.updateVis(attribute2); // Update bar chart 2
   }
   
   // window.onload = function() {
   //    updateGraphs();
   // };
   
 


// Scatterplot
let data, scatterplot;
d3.csv('data/national_health_data.csv')
  .then(csvdata => {
    console.log("hi")
    console.log(attribute1)

   data=csvdata;
    data = data.filter(d => d.attribute1 !== -1 && d.attribute2 !== -1);
    
    // Convert string values to numbers
    data.forEach(d => {
      d.attribute1 = +d.attribute1;
      d.attribute1 = +d.attribute2;
    });

    scatterplot = new Scatterplot({ parentElement: '#scatterplot'}, data, choroplethMap, attribute1, attribute2, attributeNames);
    scatterplot.updateVis();
  })
  .catch(error => console.error(error));

  // Scatter FilterButtons
d3.selectAll('.legend-btn').on('click', function() {
   // Toggle 'inactive' class
   d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));
   
   // Check which categories are active
   let selectedArea = [];
   d3.selectAll('.legend-btn:not(.inactive)').each(function() {
     selectedArea.push(d3.select(this).attr('rural_urban'));
   });
 
   // Filter data accordingly and update vis
   scatterplot.data = data.filter(d => selectedArea.includes(d.urban_rural_status));
   scatterplot.updateVis(attribute1,attribute2);
 });


// Choropleth 
 Promise.all([
  d3.json('data/counties-10m.json'),
  d3.csv('data/national_health_data.csv')
]).then(data => {
  const geoData = data[0];
  const geoData2 = data[0];
  let data_poverty = data[1];
  let filtered_health_data = data[1];


  data_poverty= data_poverty.filter(d => d[attribute1] !== '-1');
  // console.log(data_poverty)

  filtered_health_data= filtered_health_data.filter(d => d.percent_no_heath_insurance !== '-1'&& !isNaN(d.percent_no_heath_insurance));


  geoData2.objects.counties.geometries.forEach(d => {
    for (let i = 0; i < data_poverty.length; i++) {
      if (d.id === data_poverty[i].cnty_fips) {
        // console.log(attribute1)
        // console.log(`Assigning ${data_poverty[i][attribute1]} to ${attribute1} and ${d.properties.percent_no_heath_insurance}`);
        d.properties[attribute1] = +data_poverty[i][attribute1];
        
        console.log(attribute1)
        console.log(d.properties[attribute1])
      }
    }
  });

  geoData2.objects.counties.geometries.forEach(d => {
    for (let i = 0; i < filtered_health_data.length; i++) {
      if (d.id === filtered_health_data[i].cnty_fips) {
        d.properties.percent_no_heath_insurance = +filtered_health_data[i].percent_no_heath_insurance;
      }
    }
  });


  choroplethMap = new ChoroplethMap({ parentElement: '.viz'}, geoData, attribute1);
  // choroplethMap.updateVis();

  choroplethMap2 = new ChoroplethMap2({ parentElement: '.viz2'},geoData, attribute2);
  choroplethMap2.updateVis();
})
.catch(error => console.error(error));



document.getElementById('refreshButton').addEventListener('click', function() {
  // Reload the window
  window.location.reload();
});
