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
      document.getElementById('attr1').textContent = `Attribute 1 - ${attributeNames[attribute1]}`;
      document.getElementById('attr2').textContent = `Attribute 2 - ${attributeNames[attribute2]}`;
      document.getElementById('att1').textContent = `Attribute 1 - ${attributeNames[attribute1]}`;
      document.getElementById('att2').textContent = `Attribute 2 - ${attributeNames[attribute2]}`;
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
      histogram.updateVis(attribute1); // Update bar chart 1
      histogram2.updateVis(attribute2); // Update bar chart 2
   }
   
// Scatterplot
let data, scatterplot;
d3.csv('data/national_health_data.csv')
  .then(csvdata => {
   data=csvdata;
    
  //  data = data.filter(d => d[attribute1] !== '-1' && d[attribute2] !== '-1');

    // Convert string values to numbers
    data.forEach(d => {
      d[attribute1] = +d[attribute1];
      d[attribute2] = +d[attribute2];
    });

    data = data.filter(d => d[attribute1] !== '-1' && d[attribute2] !== '-1');


    scatterplot = new Scatterplot({ parentElement: '#scatterplot'}, data, choroplethMap, attribute1, attribute2, attributeNames);
    scatterplot.updateVis();

    histogram = new Histogram({ parentElement: '#histogram'}, data, attribute1);
    histogram.updateVis();

    histogram2 = new Histogram2({ parentElement: '#histogram2'}, data, attribute2);
    histogram2.updateVis();
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
  let data_poverty = data[1];
  let filtered_health_data = data[1];


  data_poverty= data_poverty.filter(d => d[attribute1] !== '-1');

  geoData.objects.counties.geometries.forEach(d => {
    for (let i = 0; i < filtered_health_data.length; i++) {
      if (d.id === filtered_health_data[i].cnty_fips) {
        // console.log(filtered_health_data[i].cnty_fips)
        d.properties.cnty_fips = +filtered_health_data[i].cnty_fips;
        d.properties.display_name = filtered_health_data[i].display_name;
        d.properties.poverty_perc = +filtered_health_data[i].poverty_perc;
        d.properties.median_household_income = +filtered_health_data[i].median_household_income;
        d.properties.education_less_than_high_school_percent = +filtered_health_data[i].education_less_than_high_school_percent;
        d.properties.air_quality = +filtered_health_data[i].air_quality;
        d.properties.park_access = +filtered_health_data[i].park_access;
        d.properties.percent_inactive = +filtered_health_data[i].percent_inactive;
        d.properties.percent_smoking = +filtered_health_data[i].percent_smoking;
        d.properties.urban_rural_status = filtered_health_data[i].urban_rural_status;
        d.properties.elderly_percentage = +filtered_health_data[i].elderly_percentage;
        d.properties.number_of_hospitals = +filtered_health_data[i].number_of_hospitals;
        d.properties.number_of_primary_care_physicians = +filtered_health_data[i].number_of_primary_care_physicians;
        d.properties.percent_no_heath_insurance = +filtered_health_data[i].percent_no_heath_insurance;
        d.properties.percent_high_blood_pressure = +filtered_health_data[i].percent_high_blood_pressure;
        d.properties.percent_coronary_heart_disease = +filtered_health_data[i].percent_coronary_heart_disease;
        d.properties.percent_stroke = +filtered_health_data[i].percent_stroke;
        d.properties.percent_high_cholesterol = +filtered_health_data[i].percent_high_cholesterol;
              }
    }
  });


  choroplethMap = new ChoroplethMap({ parentElement: '.viz'}, geoData, attribute1,attributeNames);
  // choroplethMap.updateVis();

  choroplethMap2 = new ChoroplethMap2({ parentElement: '.viz2'},geoData, attribute2);
  // choroplethMap2.updateVis();
})
.catch(error => console.error(error));


document.getElementById('refreshButton').addEventListener('click', function() {
  // Reload the window
  window.location.reload();
});


