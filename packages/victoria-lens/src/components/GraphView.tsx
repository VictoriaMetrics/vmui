// @ts-nocheck

import React, {FC, useMemo} from "react";
import {MetricResult} from "../api/types";

import {scaleOrdinal, schemeSet2} from "d3";

import {LineChart} from "./LineChart/LineChart";
import {DataSeries, TimePresets} from "../types";
import {getNameForMetric} from "../utils/metric";
import {Legend} from "./Lelend/Legend";

export interface GraphViewProps {
  data?: MetricResult[];
  timePresets: TimePresets
}

const GraphView: FC<GraphViewProps> = ({data, timePresets}) => {

  const series: DataSeries[] = useMemo(() => {
    return data?.map(d => ({
      metadata: {
        name: getNameForMetric(d)
      },
      values: d.values.map(v => ({
        key: v[0],
        value: v[1]
      }))
    }))
  }, [data])

  const seriesNames = useMemo(() => series.map(s => s.metadata.name), [series])

  const color = useMemo(() =>
      scaleOrdinal<string>()
        .domain(seriesNames) // associate series names with colors
        .range(schemeSet2), [series])

  return (
      <>
        <LineChart height={400} series={series} color={color} timePresets={timePresets}></LineChart>
        <Legend names={seriesNames} color={color} ></Legend>
      </>
  )
}

export default GraphView;