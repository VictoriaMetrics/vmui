import {MetricResult} from "../api/types";

export const getNameForMetric = (result: MetricResult) =>
    `${result.metric.instance}, ${result.metric.job}, ${result.metric.type}`;
