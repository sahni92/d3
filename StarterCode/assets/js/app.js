
function makeResponsive() {

    var svgArea = d3.select("body").select("svg");
    
    if (!svgArea.empty()) {
      svgArea.remove();
    }
    
  var svgHeight = 500
  var svgWidth = 960
  
  var margin = {
      top: 20,
      bottom: 60,
      right: 40,
      left: 100
  }
  
  var height = svgHeight - margin.left - margin.right;
  var width = svgWidth - margin.top -  margin.bottom;
  
  var svg = d3.select("#scatter")
      .append("svg")
      .attr("width",svgWidth)
      .attr("height",svgHeight)
  
      var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);    
    console.log("Blah")
      d3.csv("/assets/data/data.csv").then(function(povertyData) {
          console.log("Hello")
                povertyData.forEach((data) => {
              data.poverty = +data.poverty;
              data.healthcare = +data.healthcare;
              data.abbr = +data.abbr;
            });
  
          var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(povertyData, d => d.poverty)])
            .range([0, width]);
      
          var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(povertyData, d => d.healthcare)])
            .range([height, 0]);
  
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);
  
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);
  
      var circlesGroup = chartGroup.selectAll("circle")
      .data(povertyData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "blue")
      .attr("opacity", ".9");
  
      chartGroup.selectAll("bubble")
      .data(povertyData)
      .enter()
      .append("circle")
      .text(function(d){return d.abbr;})
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "white")
      .attr("opacity", ".5");
  
      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html((d) => {
        return (`${d.abbr}<br>Poverty Level: ${d.poverty}<br>Healthcare coverage: ${d.healthcare}`);
      });
  
      chartGroup.call(toolTip);
  
      circlesGroup.on("mouseover", (data) => {
          toolTip.show(data, this);
        })
          // onmouseout event
          .on("mouseout", (data, index) => {
            toolTip.hide(data);
          });
  
          chartGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare(%)");
  
          chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "axisText")
          .text("In Poverty (%)");
      });
}
  
  makeResponsive();
  
  //Event listener for window resize.
  d3.select(window).on("resize", makeResponsive);

  