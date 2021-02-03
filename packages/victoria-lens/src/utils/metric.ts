import {MetricBase} from "../api/types";

export const getNameForMetric = (result: MetricBase) =>
    `${result.metric.instance}, ${result.metric.job}, ${result.metric.type}`;
