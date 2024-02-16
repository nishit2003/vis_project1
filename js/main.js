
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