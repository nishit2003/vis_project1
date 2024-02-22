countyfilter=[];
let choroplethMap; // Declare choroplethMap variable at the top level

// Scatterplot
let data, scatterplot;
d3.csv('data/national_health_data.csv')
  .then(csvdata => {
   data=csvdata;
    data = data.filter(d => d.poverty_perc !== -1 && d.percent_no_heath_insurance !== -1);

    // Convert string values to numbers
    data.forEach(d => {
      d.poverty_perc = +d.poverty_perc;
      d.percent_no_heath_insurance = +d.percent_no_heath_insurance;
    });

    scatterplot = new Scatterplot({ parentElement: '#scatterplot'}, data, choroplethMap);
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
   scatterplot.updateVis();
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


  data_poverty= data_poverty.filter(d => d.poverty_perc !== '-1');
  filtered_health_data= filtered_health_data.filter(d => d.percent_no_heath_insurance !== '-1'&& !isNaN(d.percent_no_heath_insurance));


  geoData.objects.counties.geometries.forEach(d => {
    for (let i = 0; i < data_poverty.length; i++) {
      if (d.id === data_poverty[i].cnty_fips) {
        d.properties.poverty_perc = +data_poverty[i].poverty_perc;
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

  choroplethMap = new ChoroplethMap({ parentElement: '.viz'}, geoData);
  choroplethMap2 = new ChoroplethMap2({ parentElement: '.viz2'},geoData2);
})
.catch(error => console.error(error));



