/* eslint max-lines: ["error", {"max": 200}] */
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {line as d3Line, max as d3Max, min as d3Min, scaleLinear, ScaleOrdinal, scaleTime} from "d3";
import "./line-chart.css";
import Measure from "react-measure";
import {AxisBottom} from "./AxisBottom";
import {AxisLeft} from "./AxisLeft";
import {DataSeries, DataValue, TimeParams} from "../../types";
import {InteractionLine} from "./InteractionLine";
import {InteractionArea, InteractionType} from "./InteractionArea";
import {Box, Popover} from "@material-ui/core";
import {ChartTooltip} from "./ChartTooltip";

interface LineChartProps {
  series: DataSeries[];
  timePresets: TimeParams;
  height: number;
  color: ScaleOrdinal<string, string>; // maps name to color hex code
}

interface TooltipState {
  xCoord: number;
  date: Date;
  index: number;
  leftPart: boolean;
}

const TOOLTIP_MARGIN = 20;

export const LineChart: React.FC<LineChartProps> = ({series, timePresets, height, color}) => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const margin = {top: 10, right: 20, bottom: 70, left: 50};
  const svgWidth = useMemo(() => screenWidth - margin.left - margin.right, [screenWidth, margin.left, margin.right]);
  const svgHeight = useMemo(() => height - margin.top - margin.bottom, [margin.top, margin.bottom]);
  const xScale = useMemo(() => scaleTime().domain([new Date(timePresets.start * 1000), new Date(timePresets.end * 1000)]).range([0, svgWidth]), [
    svgWidth,
    timePresets
  ]);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipState, setTooltipState] = useState<TooltipState>();

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

  const handleChartInteraction = useCallback(
    async (key: InteractionType | undefined) => {
      if (typeof key === "number") { // || typeof key === "object"
        const date = new Date(series[0].values[key].key * 1000);
        setTooltipState({
          date,
          xCoord: xScale(date),
          index: key,
          leftPart: key < series[0].values.length / 2
        });
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
        setTooltipState(undefined);
      }
    },
    // [getTooltipData, xScale]
    [xScale, series]
  );

  const tooltipData = useMemo(() => {
    if (tooltipState) {
      return series.map(s => ({value: s.values[tooltipState.index].value, name: s.metadata.name}));
    } else {
      return undefined;
    }
  }, [tooltipState, series]);

  const tooltipAnchor = useRef<SVGGElement>(null);

  const seriesDates = useMemo(() => {
    return series[0].values.map(v => new Date(v.key * 1000));
  }, [series]);


  useEffect(() => console.log(timePresets), [timePresets]);
  useEffect(() => console.log(seriesDates[0]), [seriesDates]);

  return (
    <Measure bounds onResize={({bounds}) => bounds && setScreenWidth(bounds?.width)}>
      {({measureRef}) => (
        <div ref={measureRef} style={{width: "100%"}}>
          {tooltipAnchor && tooltipData && (
            <Popover
              disableScrollLock={true}
              style={{pointerEvents: "none"}} // IMPORTANT in order to allow interactions through popover's backdrop
              id="chart-tooltip-popover"
              open={showTooltip}
              anchorEl={tooltipAnchor.current}
              anchorOrigin={{
                vertical: "top",
                horizontal: tooltipState?.leftPart ? TOOLTIP_MARGIN : -TOOLTIP_MARGIN
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: tooltipState?.leftPart ? "left" : "right"
              }}
              disableRestoreFocus>
              <Box m={1}>
                <ChartTooltip data={tooltipData} time={tooltipState?.date}/>
              </Box>
            </Popover>
          )}
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
              <g ref={tooltipAnchor}>
                <InteractionLine height={svgHeight} x={tooltipState?.xCoord} />
              </g>
              {/*NOTE: in SVG last element wins - so since we want mouseover to work in all area this should be last*/}
              <InteractionArea
                xScale={xScale}
                yScale={yScale}
                datesInChart={seriesDates}
                onInteraction={handleChartInteraction}
              />
            </g>
          </svg>
        </div>
      )}
    </Measure>
  );
};
