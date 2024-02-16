/**
 * Load TopoJSON data of the world and the data of the world wonders
 */

Promise.all([
    d3.json('data/counties-10m.json'),
    d3.csv('data/national_health_data.csv')
 ]).then(data => {
    const geoData = data[0];
    const countryData = data[1];
 
    // Combine both datasets by adding the population density to the TopoJSON file
    const counties = geoData.objects.counties; // Access counties geometries

      geoData.objects.collection.geometries.forEach(d => {
          for (let i = 0; i < countryData.length; i++) {
               if (d.properties.name == countryData[i].display_name) {
                   d.properties.pop_density = +countryData[i].poverty_perc;
               }
          }
      });
 
      new ChoroplethMap({ 
          parentElement: '#choropleth'
      }, data[0]);
 })

 .catch(error => console.error(error));
 
 class ChoroplethMap {

    /**
      * Class constructor with basic configuration
      * @param {Object}
      * @param {Array}
      */
    constructor(_config, _data) {
       this.config = {
          parentElement: _config.parentElement,
          containerWidth: _config.containerWidth || 1000,
          containerHeight: _config.containerHeight || 500,
          margin: _config.margin || {top: 10, right: 10, bottom: 10, left: 10},
          tooltipPadding: 10,
          legendBottom: 50,
          legendLeft: 50,
          legendRectHeight: 12, 
          legendRectWidth: 150
       }
       this.data = _data;
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
 
       vis.projection = d3.geoAlbersUsa()
                   .translate([vis.width /2 , vis.height / 2])
                   .scale(vis.width);
 
       vis.colorScale = d3.scaleLinear()
          .domain(d3.extent(vis.data, d => d.poverty_perc)) // Assuming 'poverty_perc' is the attribute name in the data
          .range(['#cfe2f2', '#0d306b'])
          .interpolate(d3.interpolateHcl);
 
       vis.path = d3.geoPath()
                   .projection(vis.projection);
 
       vis.g = vis.svg.append("g")
                   .attr('class', 'center-container center-items us-state')
                   .attr('transform', 'translate('+vis.config.margin.left+','+vis.config.margin.top+')')
                   .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
                   .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)
 
       // Append counties
       vis.g.selectAll(".county")
          .data(topojson.feature(vis.data, vis.data.objects.counties).features)
          .enter().append("path")
          .attr("class", "county")
          .attr("d", vis.path)
          .style("fill", d => {
             const countyData = d.properties.poverty_perc; // Access poverty_perc for each county
             if (countyData) {
                return vis.colorScale(countyData);
             } else {
                return "gray"; // Or any default color for missing data
             }
          });
 
       // Add tooltip
       vis.g.selectAll(".county")
          .append("title")
          .text(d => d.properties.name + ": " + (d.properties.poverty_perc ? d.properties.poverty_perc : "No data"));
 
       // Add state borders
       vis.g.append("path")
          .datum(topojson.mesh(vis.data, vis.data.objects.states, (a, b) => a !== b))
          .attr("class", "state-boundary")
          .attr("d", vis.path);
    }
 }
 