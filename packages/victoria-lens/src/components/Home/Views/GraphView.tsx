import React, {FC, useEffect, useMemo, useState} from "react";
import {MetricResult} from "../../../api/types";

import {scaleOrdinal, schemeCategory10} from "d3";

import {LineChart} from "../../LineChart/LineChart";
import {DataSeries, TimeParams} from "../../../types";
import {getNameForMetric} from "../../../utils/metric";
import {Legend, LegendItem} from "../../Legend/Legend";

export interface GraphViewProps {
  data: MetricResult[];
  timePresets: TimeParams
}

const GraphView: FC<GraphViewProps> = ({data, timePresets}) => {

  const series: DataSeries[] = useMemo(() => {
    return data?.map(d => ({
      metadata: {
        name: getNameForMetric(d)
      },
      // VM metrics are tuples - much simpler to work with objects in chart
      values: d.values.map(v => ({
        key: v[0],
        value: +v[1]
      }))
    }));
  }, [data]);

  const seriesNames = useMemo(() => series.map(s => s.metadata.name), [series]);

  const color = useMemo(() =>
    scaleOrdinal<string>()
      .domain(seriesNames) // associate series names with colors
      .range(schemeCategory10), [seriesNames]);

  const initLabels = useMemo(() => {
    return seriesNames.map(name => ({
      color: color(name),
      label: name,
      checked: true // init with checked always
    } as LegendItem));
  }, [color, seriesNames]);

  const [labels, setLabels] = useState(initLabels);

  useEffect(() => {
    setLabels(initLabels);
  }, [initLabels]);

  const visibleNames = useMemo(() => labels.filter(l => l.checked).map(l => l.label), [labels]);

  const visibleSeries = useMemo(() => series.filter(s => visibleNames.includes(s.metadata.name)), [series, visibleNames]);

  const onLegendChange = (index: number) => {
    setLabels(prevState => {
      if (prevState) {
        const newState = [...prevState];
        newState[index] = {...newState[index], checked: !newState[index].checked};
        return newState;
      }
      return prevState;
    });
  };

  return (
    <>
      <LineChart height={400} series={visibleSeries} color={color} timePresets={timePresets}></LineChart>
      <Legend labels={labels} onChange={onLegendChange}></Legend>
    </>
  );
};

export default GraphView;