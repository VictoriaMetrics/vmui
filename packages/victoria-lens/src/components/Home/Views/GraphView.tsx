import React, {FC, useEffect, useMemo, useState} from "react";
import {MetricResult} from "../../../api/types";

import {scaleOrdinal, schemeCategory10} from "d3";

import {LineChart} from "../../LineChart/LineChart";
import {DataSeries, TimeParams} from "../../../types";
import {getNameForMetric} from "../../../utils/metric";
import {Legend, LegendItem} from "../../Legend/Legend";
import {getSortedCategories} from "../../../hooks/getSortedCategories";

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
      metric: d.metric,
      // VM metrics are tuples - much simpler to work with objects in chart
      values: d.values.map(v => ({
        key: v[0],
        value: +v[1]
      }))
    }));
  }, [data]);

  const sortedCategories = getSortedCategories(data);

  const seriesNames = useMemo(() => series.map(s => s.metadata.name), [series]);

  // should not change as often as array of series names (for instance between executions of same query) to
  // keep related state (like selection of a labels)
  const [seriesNamesStable, setSeriesNamesStable] = useState(seriesNames);

  useEffect(() => {
    // primitive way to check the fact that array contents are identical
    if (seriesNamesStable.join(",") !== seriesNames.join(",")) {
      setSeriesNamesStable(seriesNames);
    }
  }, [seriesNames, setSeriesNamesStable, seriesNamesStable]);

  const color = useMemo(() =>
    scaleOrdinal<string>()
      .domain(seriesNamesStable) // associate series names with colors
      .range(schemeCategory10), [seriesNamesStable]);

  // changes only if names of series are different
  const initLabels = useMemo(() => {
    return seriesNamesStable.map(name => ({
      color: color(name),
      seriesName: name,
      labelData: series.find(s => s.metadata.name === name)?.metric, // find is O(n) - can do faster
      checked: true // init with checked always
    } as LegendItem));
  }, [color, seriesNamesStable]);

  const [labels, setLabels] = useState(initLabels);

  useEffect(() => {
    setLabels(initLabels);
  }, [initLabels]);

  const visibleNames = useMemo(() => labels.filter(l => l.checked).map(l => l.seriesName), [labels]);

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
      <LineChart height={400} series={visibleSeries} color={color} timePresets={timePresets} categories={sortedCategories}></LineChart>
      <Legend labels={labels} onChange={onLegendChange} categories={sortedCategories}></Legend>
    </>
  );
};

export default GraphView;