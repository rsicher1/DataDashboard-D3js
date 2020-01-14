createPie = (width, height) => {
  const pie = d3
    .select('#pie')
    .attr('width', width)
    .attr('height', height);

  pie
    .append('g')
    .attr(
      'transform',
      'translate(' + width / 2 + ', ' + (height / 2 + 10) + ')'
    )
    .classed('chart', true);

  pie
    .append('text')
    .attr('x', width / 2)
    .attr('y', '1em')
    .attr('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .classed('pie-title', true);
};

const drawPie = (data, currentYear) => {
  const pie = d3.select('#pie');

  const arcs = d3
    .pie()
    .sort((a, b) => {
      if (a.continent < b.continent) return -1;
      if (a.continent > b.continent) return 1;
      return a.emissions - b.emissions;
    })
    .value(d => d.emissions);

  const path = d3
    .arc()
    .outerRadius(+pie.attr('height') / 2 - 50)
    .innerRadius(0);

  const yearData = data.filter(d => d.year === currentYear);
  const continents = [];
  for (let year of yearData) {
    const continent = year.continent;
    if (!continents.includes(continent)) {
      continents.push(continent);
    }
  }

  const colorScale = d3
    .scaleOrdinal()
    .domain(continents)
    .range(['#ab47bc', '#7e57c2', '#26a69a', '#42a5f5', '#78909c']);

  const update = pie
    .select('.chart')
    .selectAll('.arc')
    .data(arcs(yearData));

  update.exit().remove();

  const enter = update
    .enter()
    .append('path')
    .classed('arc', true)
    .attr('stroke', '#dff1ff')
    .attr('stroke-width', '0.25px');

  enter
    .merge(update)
    .attr('fill', d => colorScale(d.data.continent))
    .attr('d', path);

  pie
    .select('.pie-title')
    .text('Total emissions by continent and region, ' + currentYear);
};
