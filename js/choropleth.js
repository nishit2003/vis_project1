
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
   var attribute1 = document.getElementById('attributesSelect1').value;
   var attribute2 = document.getElementById('attributesSelect2').value;
 
   // Update header with selected attributes
   document.getElementById('dashboardTitle').textContent = `US Health Dashboard - ${attributeNames[attribute1]} vs ${attributeNames[attribute2]}`;
 });
 

class ChoroplethMap {

   /**
    * Class constructor with basic configuration
    * @param {Object}
    * @param {Array}
    */
   constructor(_config, _data,_scatterplot) {
     this.config = {
       parentElement: _config.parentElement,
       containerWidth: _config.containerWidth || 550,
       containerHeight: _config.containerHeight || 700,
       margin: _config.margin || {top: 10, right: 0, bottom: 10, left: 0},
       tooltipPadding: 10,
       legendBottom: 50,
       legendLeft: 20,
       legendRectHeight: 12, 
       legendRectWidth: 150
     }
     this.data = _data;
     // this.config = _config;
 
     this.us = _data;
     this.active = d3.select(null); 
     this.scatterplot = _scatterplot;

     this.initVis();

   }

   /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  
  initVis() {
   let vis = this;

   // Calculate inner chart size. Margin specifies the space around the actual chart.
   vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
   vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

   // Define size of SVG drawing area
   vis.svg = d3.select(vis.config.parentElement).append('svg')
       .attr('class', 'center-container')
       .attr('width', vis.config.containerWidth)
       .attr('height', vis.config.containerHeight);

   vis.svg.append('rect')
           .attr('class', 'background center-container')
           .attr('height', vis.config.containerWidth ) 
           .attr('width', vis.config.containerHeight) 
           .on('click', vis.clicked);

 
   vis.projection = d3.geoAlbersUsa()
           .translate([vis.width /2 , vis.height / 2])
           .scale(vis.width);

   vis.colorScale = d3.scaleLinear()
     .domain(d3.extent(vis.data.objects.counties.geometries, d => d.properties.poverty_perc))
       .range(['#cfe2f2', '#0d306b'])
       .interpolate(d3.interpolateHcl);

   vis.path = d3.geoPath()
           .projection(vis.projection);

   vis.g = vis.svg.append("g")
           .attr('class', 'center-container center-items us-state')
           .attr('transform', 'translate('+vis.config.margin.left+','+vis.config.margin.top+')')
           .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
           .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)


   vis.counties = vis.g.append("g")
               .attr("id", "counties")
               .selectAll("path")
               .data(topojson.feature(vis.us, vis.us.objects.counties).features)
               .enter().append("path")
               .attr("d", vis.path)
               // .attr("class", "county-boundary")
               .attr('fill', d => {
                     if (d.properties.poverty_perc !== -1) {
                       return vis.colorScale(d.properties.poverty_perc);
                     } else {
                       return 'url(#lightstripe)';
                     }
                   });

     vis.counties
               .on('mousemove', (event,d) => {
               //   console.log(d);
               //   console.log(event);
                   const povertyRate = d.properties.poverty_perc ? `<strong>${d.properties.poverty_perc}</strong> % poverty rate` : 'No data available'; 

                   d3.select('#tooltip_map')
                     .style('display', 'block')
                     .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                     .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                     .html(`
                       <div class="tooltip_map-title">${d.properties.name}</div>
                       <div>${povertyRate}</div>
                     `);
                 })
                 .on('mouseleave', () => {
                   d3.select('#tooltip_map').style('display', 'none');
                 });


   vis.g.append("path")
               .datum(topojson.mesh(vis.us, vis.us.objects.states, function(a, b) { return a !== b; }))
               .attr("id", "state-borders")
               .attr("d", vis.path);

   }

 }

