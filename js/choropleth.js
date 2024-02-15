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
   geoData.objects.collection.geometries.forEach(d => {
     for (let i = 0; i < countryData.length; i++) {
       if (d.properties.name == countryData[i].region) {
         d.properties.pop_density = +countryData[i].pop_density;
       }
     }
   });
 
   const choroplethMap = new ChoroplethMap({ 
     parentElement: '#map'
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
       containerWidth: _config.containerWidth || 500,
       containerHeight: _config.containerHeight || 400,
       margin: _config.margin || {top: 0, right: 0, bottom: 0, left: 0},
       tooltipPadding: 10,
       legendBottom: 50,
       legendLeft: 50,
       legendRectHeight: 12, 
       legendRectWidth: 150
     }
     this.data = _data;
     this.initVis();
   }





}