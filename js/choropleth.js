class ChoroplethMap {

  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _attribute1) {
      this.config = {
          parentElement: _config.parentElement,
          containerWidth: _config.containerWidth || 750,
          containerHeight: _config.containerHeight || 700,
          margin: _config.margin || {
              top: 10,
              right: 0,
              bottom: 10,
              left: 0
          },
          tooltipPadding: 10,
          legendBottom: 50,
          legendLeft: 0,
          legendRectHeight: 12,
          legendRectWidth: 150
      }
      this.data = _data;
      //   this.config = _config;

      this.us = {
          ..._data
      };

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
          .attr('height', vis.config.containerWidth)
          .attr('width', vis.config.containerHeight)
          .on('click', vis.clicked);


      vis.projection = d3.geoAlbersUsa()
          .translate([vis.width / 2, vis.height / 2])
          .scale(vis.width);


      vis.path = d3.geoPath()
          .projection(vis.projection);

      vis.g = vis.svg.append("g")
          .attr('class', 'center-container center-items us-state')
          .attr('transform', 'translate(' + vis.config.margin.left + ',' + vis.config.margin.top + ')')
          .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
          .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)

      vis.g.append("path")
          .datum(topojson.mesh(vis.us, vis.us.objects.states, function(a, b) {
              return a !== b;
          }))
          .attr("id", "state-borders")
          .attr("d", vis.path);

          vis.linearGradient = vis.svg.append('defs').append('linearGradient')
        .attr("id", "legend-gradient");

          vis.legend = vis.svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${vis.config.legendLeft},${vis.height - vis.config.legendBottom})`);

        vis.legendRect = vis.legend.append('rect')
        .attr('width', vis.config.legendRectWidth)
        .attr('height', vis.config.legendRectHeight);

    vis.legendTitle = vis.legend.append('text')
        .attr('class', 'legend-title')
        .attr('dy', '.35em')
        .attr('y', -10)
        .text(attributeNames1[attribute1]);
        
        }

  /**
   * Method to update the visualization based on new data or configuration.
   */

  updateVis(attribute1) {
    let vis = this;


    vis.colorScale = d3.scaleLinear()
    .domain(d3.extent(vis.data.objects.counties.geometries, d => d.properties[attribute1]))
    .range(['#d1eaeb', '#141717'])
    .interpolate(d3.interpolateHcl);

    vis.legendStops = [
        { color: '#d1eaeb', value: attribute1[0], offset: 0},
        { color: '#141717', value: attribute1[1], offset: 100},
      ];

      vis.counties = vis.g.append("g")
          .attr("id", "counties")
          .selectAll("path")
          .data(topojson.feature(vis.us, vis.us.objects.counties).features)
          .enter().append("path")
          .attr("d", vis.path)
          // .attr("class", "county-boundary")
          .attr('fill', d => {
            // console.log(d.properties[attribute1]);

              if (d.properties[attribute1] !== -1) {
                // console.log(d.properties);

                  return vis.colorScale(d.properties[attribute1]);
              } else {
                  return 'url(#lightstripe)';
              }
          });

      vis.counties
          .on('mousemove', (event, d) => {
              //   console.log(d);
              //   console.log(event);
              const People_wo_H = d.properties[attribute1] ? `<strong>${d.properties[attribute1]}</strong> % : ${attributeNames1[attribute1]}` : "0";

              d3.select('#tooltip_map')
                  .style('display', 'block')
                  .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                  .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                  .html(`
                       <div class="tooltip_map-title">${d.properties.name}</div>
                       <div>${People_wo_H}</div>
                     `);
          })
          .on('mouseleave', () => {
              d3.select('#tooltip_map').style('display', 'none');
          });

        // vis.legend.selectAll('.legend-label')
        //   .data(vis.legendStops)
        // .join('text')
        //   .attr('class', 'legend-label')
        //   .attr('text-anchor', 'middle')
        //   .attr('dy', '.35em')
        //   .attr('y', 20)
        //   .attr('x', (d,index) => {
        //     return index == 0 ? 0 : vis.config.legendRectWidth;
        //   })
        //   .text(d => Math.round(d.value * 10 ) / 10);
  
      // Update gradient for legend
      vis.linearGradient.selectAll('stop')
          .data(vis.legendStops)
        .join('stop')
          .attr('offset', d => d.offset)
          .attr('stop-color', d => d.color);
  
      vis.legendRect.attr('fill', 'url(#legend-gradient)');
      
  }


highlightCounties(countyIDs) {
  // console.log(countyIDs);
  let vis = this;

  vis.counties.attr('fill', d => {
      // console.log(d)
      // console.log("d.cnty_fips:", d.cnty_fips);
      if (countyIDs.includes(d.id)) {
          // console.log("hi");
          return '#FFA899';
      } else {
          if (d.properties.attribute1 !== -1) {
              return vis.colorScale(d.properties[attribute1]);
            // return "#ffffff";
          } else {
              return '#ffffff';

          }
      }
  });
}

}
