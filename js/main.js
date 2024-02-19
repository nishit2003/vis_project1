
// Scatterplot
// Load data from CSV file asynchronously
let data, scatterplot;
d3.csv('data/national_health_data.csv')
  .then(csvdata => {
   data=csvdata;
    // Filter out rows with value -1 for both variables
    data = data.filter(d => d.poverty_perc !== -1 && d.percent_no_heath_insurance !== -1);

    // Convert string values to numbers
    data.forEach(d => {
      d.poverty_perc = +d.poverty_perc;
      d.percent_no_heath_insurance = +d.percent_no_heath_insurance;
    });

    scatterplot = new Scatterplot({ parentElement: '#scatterplot'}, data);
    scatterplot.updateVis();

  })
  .catch(error => console.error(error));


  /**
 * Event listener: use color legend as filter
 */

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
   scatterplot.updateVis();
 });

// Choropleth from here *********

 Promise.all([
  d3.json('data/counties-10m.json'),
  d3.csv('data/national_health_data.csv')
]).then(data => {
  const geoData = data[0];
  let filtered_health_data = data[1];

  filtered_health_data= filtered_health_data.filter(d => d.poverty_perc !== '-1');

  // Combine both datasets by adding the population density to the TopoJSON file
  // console.log(geoData);
  geoData.objects.counties.geometries.forEach(d => {
    // console.log(d);  
    for (let i = 0; i < filtered_health_data.length; i++) {
      if (d.id === filtered_health_data[i].cnty_fips) {
        d.properties.poverty_perc = +filtered_health_data[i].poverty_perc;
      }

    }
  });

  const choroplethMap = new ChoroplethMap({ 
    parentElement: '.viz',   
  }, geoData);
})
.catch(error => console.error(error));


// Map 2 right

Promise.all([
  d3.json('data/counties-10m.json'),
  d3.csv('data/national_health_data.csv')
]).then(data => {
  const geoData2 = data[0];
  let filtered_health_data = data[1];

  filtered_health_data= filtered_health_data.filter(d => d.percent_no_heath_insurance !== '-1'&& !isNaN(d.percent_no_heath_insurance));

  // Combine both datasets by adding the population density to the TopoJSON file
  // console.log(geoData);
  geoData2.objects.counties.geometries.forEach(d => {
    // console.log(d);  
    for (let i = 0; i < filtered_health_data.length; i++) {
      if (d.id === filtered_health_data[i].cnty_fips) {
        d.properties.percent_no_heath_insurance = +filtered_health_data[i].percent_no_heath_insurance;
      }

    }
  });

  const choroplethMap = new ChoroplethMap2({ 
    parentElement: '.viz2',   
  }, geoData2);
})
.catch(error => console.error(error));

// Choropleth till here *********



// Bar Charts ********************
