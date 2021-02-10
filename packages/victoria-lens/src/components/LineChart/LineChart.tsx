import React, {useMemo, useState} from "react";
import {line as d3Line, max as d3Max, min as d3Min, scaleLinear, ScaleOrdinal, scaleTime} from "d3";
import "./line-chart.css";
import Measure from "react-measure";
import {AxisBottom} from "./AxisBottom";
import {AxisLeft} from "./AxisLeft";
import {DataSeries, DataValue, TimeParams} from "../../types";

interface LineChartProps {
  series: DataSeries[];
  timePresets: TimeParams;
  height: number;
  color: ScaleOrdinal<string, string> // maps name to color hex code
}

export const LineChart: React.FC<LineChartProps> = ({series, timePresets, height, color}) => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const margin = {top: 10, right: 20, bottom: 70, left: 50};
  const svgWidth = useMemo(() => screenWidth - margin.left - margin.right, [screenWidth, margin.left, margin.right]);
  const svgHeight = useMemo(() => height - margin.top - margin.bottom, [margin.top, margin.bottom]);
  const xScale = useMemo(() => scaleTime().domain([new Date(timePresets.start * 1000), new Date(timePresets.end * 1000)]).range([0, svgWidth]), [
    svgWidth,
    timePresets
  ]);

  const yAxisLabel = ""; // TODO: label

  const yScale = useMemo(
    () => {
      const seriesValues = series.reduce((acc: DataValue[], next: DataSeries) => [...acc, ...next.values], []).map(_ => _.value);
      const max = d3Max(seriesValues) ?? 1; // || 1 will cause one additional tick if max is 0
      const min = d3Min(seriesValues) || 0;
      return scaleLinear()
        .domain([min > 0 ? 0 : min, max < 0 ? 0 : max]) // input
        .range([svgHeight, 0])
        .nice();
    },
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

  return (
    <Measure bounds onResize={({bounds}) => bounds && setScreenWidth(bounds?.width)}>
      {({measureRef}) => (
        <div ref={measureRef} style={{width: "100%"}}>

          <svg width="100%" height={height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <defs>
                {/*Clip path helps to clip the line*/}
                <clipPath id="clip-line">
                  {/*Transforming and adding size to clip-path in order to avoid clipping of chart elements*/}
                  <rect transform={"translate(0, -2)"} width={xScale.range()[1] + 4} height={yScale.range()[0] + 2} />
                </clipPath>
              </defs>
              <AxisBottom xScale={xScale} height={svgHeight} />
              <AxisLeft yScale={yScale} label={yAxisLabel} />
              {series.map((s, i) =>
                <path stroke={color(s.metadata.name)}
                  key={i} className="line"
                  d={getDataLine(s) as string}
                  clipPath="url(#clip-line)"/>)}
            </g>
          </svg>
        </div>
      )}
    </Measure>
  );
};
