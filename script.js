d3.csv('https://gist.githubusercontent.com/lorenzo-lipp/2e4ce20dec690e7f1211cbc82ef1b897/raw/96869eeeb9544dd9b93f5f717da357c23569f8a0/Brazil-2020.csv')
  .then(data => {
    renderData(data);
  });

function renderData(data) {
  const w = 800;
  const h = 500;
  const padding = 60;
  const yLabelOffset = 20;
  let totalMale = 0;
  let totalFemale = 0;
  let maxMale = 0;
  let maxFemale = 0;

  data.forEach(entry => { 
    entry.M = +entry.M;
    entry.F = +entry.F;

    totalMale += entry.M;
    totalFemale += entry.F;

    if (entry.M > maxMale) maxMale = entry.M;
    if (entry.F > maxFemale) maxFemale = entry.F;
  });

  let totalPopulation = totalMale + totalFemale;

  const xScaleMale = d3.scaleLinear()
    .domain([4.5, 0])
    .range([padding, (w - padding) / 2]);

  const xScaleFemale = d3.scaleLinear()
    .domain([0, 4.5])
    .range([(w + padding) / 2, w - padding]);

  const tooltip = d3.select('#graph')
    .append('div')
    .attr('id', 'tooltip');

  const mouseover = () => tooltip.style('display', 'flex');
  const mouseleave = () => tooltip.style('display', 'none');
  const mousemove = (event) => {
    const target = d3.select(event.target);
    const type = target.attr('data-type');
    const population = Number(target.attr('data-population')).toLocaleString();
    const percentage = Number(target.attr('data-percentage')).toFixed(2);
  
    tooltip.html(`
      ${population} (${percentage}%)
    `);
  
    const width = tooltip.node().getBoundingClientRect().width;
  
    tooltip.style("top", `${event.pageY + 20}px`)
      .style("left", `${event.pageX - width / 2}px`)
      .style('color', type === "male" ? "royalblue" : "crimson");
  }

  d3.select('svg')
    .append('text')
    .attr('id', 'title')
    .attr('x', '50%')
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .text('Brazil\'s Population Pyramid (2020)');

  d3.select('svg')
    .append('text')
    .attr('id', 'subtitle-male')
    .attr('x', '30%')
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Male');

  d3.select('svg')
    .append('text')
    .attr('id', 'subtitle-female')
    .attr('x', '70%')
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Female');

  d3.select('svg')
    .append('text')
    .attr('id', 'y-label')
    .attr('x', w / 2)
    .attr('y', h - yLabelOffset)
    .attr('text-anchor', 'middle')
    .text('Population (%)');

  d3.select('svg')
    .append('g')
    .selectAll('fakeSelection')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'male')
    .attr('data-type', "male")
    .attr('data-population', ({M}) => M)
    .attr('data-percentage', ({M}) => M / totalPopulation * 100)
    .attr('x', ({M}) => xScaleMale(M / totalPopulation * 100))
    .attr('y', (_, i) => h - padding - 20 - i * 19)
    .attr('height', 18)
    .attr('width', ({M}) => Math.max(371 - xScaleMale(M / totalPopulation * 100), 1))
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave)
    .on('mousemove', mousemove);

  d3.select('svg')
    .append('g')
    .selectAll('fakeSelection')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'female')
    .attr('data-type', "female")
    .attr('data-population', ({F}) => F)
    .attr('data-percentage', ({F}) => F / totalPopulation * 100)
    .attr('x', 310 + padding * 2)
    .attr('y', (_, i) => h - padding - 20 - i * 19)
    .attr('height', 18)
    .attr('width', ({F}) => Math.max(xScaleFemale(F / totalPopulation * 100) - (310 + padding * 2), 1))
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave)
    .on('mousemove', mousemove);

  d3.select('svg')
    .append('g')
    .attr('id', 'y-axis-2')
    .attr('transform', `translate(${w / 2}, ${(-20)})`)
    .selectAll('fakeSelection')
    .data(data)
    .enter()
    .append('text')
    .attr('x', 0)
    .attr('y', (_, i) => h - 45 - i * 19)
    .attr('text-anchor', 'middle')
    .text(d => d.Age.replace("-", " - "));

  const xAxisMale = d3.axisBottom(xScaleMale)
    .tickValues(Array(10).fill(0).map((_, i) => i * 0.5))
    .tickFormat(v => parseInt(v) == v ? v : "");
  d3.select('svg')
    .append('g')
    .attr('id', 'x-axis-male')
    .attr('transform', `translate(0, ${(h - padding)})`)
    .call(xAxisMale);

  const xAxisFemale = d3.axisBottom(xScaleFemale)
    .tickValues(Array(10).fill(0).map((_, i) => i * 0.5))
    .tickFormat(v => parseInt(v) == v ? v : "");
  d3.select('svg')
    .append('g')
    .attr('id', 'x-axis-female')
    .attr('transform', `translate(0, ${(h - padding)})`)
    .call(xAxisFemale);
}