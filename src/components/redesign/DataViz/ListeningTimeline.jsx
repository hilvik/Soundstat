import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as d3 from 'd3'

const ListeningTimeline = ({ data }) => {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })
  
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const resizeObserver = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect
      setDimensions({ width, height: 400 })
    })
    
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])
  
  useEffect(() => {
    if (!data || !svgRef.current || dimensions.width === 0) return
    
    const margin = { top: 40, right: 40, bottom: 60, left: 60 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom
    
    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove()
    
    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
    
    // Parse time data
    const parseTime = d3.timeParse("%Y-%m-%d")
    const formattedData = data.map(d => ({
      date: parseTime(d.date),
      playcount: d.playcount
    }))
    
    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([0, width])
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.playcount)])
      .nice()
      .range([height, 0])
    
    // Line generator with curve
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.playcount))
      .curve(d3.curveMonotoneX)
    
    // Area generator
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.playcount))
      .curve(d3.curveMonotoneX)
    
    // Add gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", yScale(0))
      .attr("x2", 0).attr("y2", yScale(d3.max(formattedData, d => d.playcount)))
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#6366F1")
      .attr("stop-opacity", 0.3)
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6366F1")
      .attr("stop-opacity", 0)
    
    // Add area
    g.append("path")
      .datum(formattedData)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1)
    
    // Add line
    const path = g.append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", "#6366F1")
      .attr("stroke-width", 3)
      .attr("d", line)
    
    // Animate line drawing
    const totalLength = path.node().getTotalLength()
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0)
    
    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%b"))
        .ticks(6))
      .style("color", "#6B7280")
    
    g.append("g")
      .call(d3.axisLeft(yScale)
        .ticks(5))
      .style("color", "#6B7280")
    
    // Add interactive dots
    const dots = g.selectAll(".dot")
      .data(formattedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.playcount))
      .attr("r", 0)
      .attr("fill", "#6366F1")
      .on("mouseenter", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6)
          .attr("fill", "#4F46E5")
        
        // Show tooltip
        const tooltip = g.append("g")
          .attr("id", "tooltip")
        
        const rect = tooltip.append("rect")
          .attr("x", xScale(d.date) - 50)
          .attr("y", yScale(d.playcount) - 35)
          .attr("width", 100)
          .attr("height", 30)
          .attr("fill", "white")
          .attr("stroke", "#E5E7EB")
          .attr("rx", 8)
          .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))")
        
        tooltip.append("text")
          .attr("x", xScale(d.date))
          .attr("y", yScale(d.playcount) - 15)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("fill", "#1F2937")
          .text(`${d.playcount} plays`)
      })
      .on("mouseleave", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 4)
          .attr("fill", "#6366F1")
        
        g.select("#tooltip").remove()
      })
    
    // Animate dots appearance
    dots.transition()
      .delay((d, i) => i * 50)
      .duration(500)
      .attr("r", 4)
    
  }, [data, dimensions])
  
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Listening Timeline</h3>
        <p className="text-gray-500 mt-1">Your musical journey over time</p>
      </div>
      
      <svg ref={svgRef} className="w-full" />
    </motion.div>
  )
}

export default ListeningTimeline