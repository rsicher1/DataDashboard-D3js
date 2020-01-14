const createMap = (width, height) => {
  d3.select('#map')
    .attr('width', width)
    .attr('height', height)
    .append('text')
    .attr('x', width / 2)
    .attr('y', '1em')
    .attr('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .classed('map-title', true);
};

const graphTitle = str => {
  return str.replace(/[A-Z]/g, c => ' ' + c.toLowerCase());
};

const drawMap = (geoData, climateData, year, dataType) => {
  const map = d3.select('#map');

  const projection = d3
    .geoMercator()
    .scale(110)
    .translate([+map.attr('width') / 2, +map.attr('height') / 1.4]);

  const path = d3.geoPath().projection(projection);

  d3.select('#year-val').text(year);

  geoData.forEach(d => {
    const countries = climateData.filter(row => row.countryCode === d.id);
    let name = '';
    if (countries.length > 0) name = countries[0].country;
    d.properties = countries.find(c => c.year === year) || { country: name };
  });

  const colors = ['#f1c40f', '#e67e22', '#e74c3c', '#c0392b'];

  const domains = {
    emissions: [0, 2.5e5, 1e6, 5e6],
    emissionsPerCapita: [0, 0.5, 2, 10],
  };

  const mapColorScale = d3
    .scaleLinear()
    .domain(domains[dataType])
    .range(colors);

  const update = map.selectAll('.country').data(geoData);

  const enter = update
    .enter()
    .append('path')
    .classed('country', true)
    .attr('d', path)
    .on('click', function() {
      const currentDataType = d3.select('input:checked').property('value');
      const country = d3.select(this);
      const isActive = country.classed('active');
      const countryName = isActive ? '' : country.data()[0].properties.country;
      drawBar(climateData, currentDataType, countryName);
      highlightBars(+d3.select('#year').property('value'));
      d3.selectAll('.country').classed('active', false);
      country.classed('active', !isActive);
    });

  enter
    .merge(update)
    .transition()
    .duration(750)
    .attr('fill', d => {
      var val = d.properties[dataType];
      return val ? mapColorScale(val) : '#ccc';
    });

  d3.select('.map-title').text(
    'Carbon dioxide ' + graphTitle(dataType) + ', ' + year
  );
};
