import React, {useCallback, useMemo, useRef, useState} from "react";
import {line as d3Line, max as d3Max, scaleLinear, ScaleOrdinal, scaleTime} from "d3";
import "./line-chart.css";
import Measure from "react-measure";
import {AxisBottom} from "./AxisBottom";
import {AxisLeft} from "./AxisLeft";
import {InteractionType} from "./InteractionArea";
import {InteractionLine} from "./InteractionLine";
import {DataSeries, DataValue, TimePresets} from "../../types";

interface LineChartProps {
  series: DataSeries[];
  timePresets: TimePresets;
  height: number;
  color: ScaleOrdinal<string, string> // maps name to color hex code
}

export const LineChart: React.FC<LineChartProps> = ({series, timePresets, height, color}) => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const [showTooltip, setShowTooltip] = useState(false);

  const [xCoord, setXCoord] = useState<number>();
  const [xKey, setXKey] = useState<InteractionType>();

  const margin = {top: 10, right: 20, bottom: 70, left: 50};
  const svgWidth = useMemo(() => screenWidth - margin.left - margin.right, [screenWidth, margin.left, margin.right]);
  const svgHeight = useMemo(() => height - margin.top - margin.bottom, [margin.top, margin.bottom]);
  const xScale = useMemo(() => scaleTime().domain([new Date(timePresets.start * 1000), new Date(timePresets.end * 1000)]).range([0, svgWidth]), [
    svgWidth,
    timePresets
  ]);

  const yAxisLabel = "TODO: label";

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, d3Max(series.reduce((acc: DataValue[], next: DataSeries) => [...acc, ...next.values], []), (_) => +_.value) || 1]) // input
        .range([svgHeight, 0])
        .nice(),
    [series, svgHeight]
  );

  const line = useMemo(
    () =>
      d3Line<DataValue>()
        .x((d) => xScale(new Date(d.key * 1000)))
        .y((d) => yScale(d.value || 0)),
    [xScale, yScale]
  );
  const getDataLine = (series: DataSeries) => line(series.values);

  const handleChartInteraction = useCallback(
    (key: number) => {
      setXCoord(xScale(new Date(key)));
      setXKey(key);
      setShowTooltip(true);
    },
    [xScale]
  );

  // not sure it is ok to connect to g - not to interaction area
  const tooltipAnchor = useRef<SVGGElement>(null);

  return (
    <Measure bounds onResize={({bounds}) => bounds && setScreenWidth(bounds?.width)}>
      {({measureRef}) => (
        <div ref={measureRef} style={{width: "100%"}}>

          <svg width="100%" height={height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <defs>
                {/*Clip path helps to clip the line*/}
                <clipPath id="clip-line">
                  <rect width={xScale.range()[1]} height={yScale.range()[0]} />
                </clipPath>
              </defs>
              <AxisBottom xScale={xScale} height={svgHeight} />
              <AxisLeft yScale={yScale} label={yAxisLabel} />
              {series.map((s, i) =>
                  <path stroke={color(s.metadata.name)} key={i} className="line" d={getDataLine(s) as string} clipPath="url(#clip-line)" />)}

              <InteractionLine height={svgHeight} x={xCoord} />
              {/*NOTE: in SVG last element wins - so since we want mouseover to work in all area this should be last*/}
              {/*<g ref={tooltipAnchor}>*/}
              {/*  <InteractionArea*/}
              {/*    xScale={xScale}*/}
              {/*    yScale={yScale}*/}
              {/*    dataForChart={aggregatedData}*/}
              {/*    onInteraction={handleChartInteraction}*/}
              {/*  />*/}
              {/*</g>*/}
            </g>
          </svg>
        </div>
      )}
    </Measure>
  );
};
