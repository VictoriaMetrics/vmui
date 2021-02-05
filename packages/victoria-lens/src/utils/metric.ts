import {MetricBase} from "../api/types";

export const getNameForMetric = (result: MetricBase) => {
  const { __name__: name, ...freeFormFields } = result.metric;
  return `${name || ""} {${Object.entries(freeFormFields).map(e => `${e[0]}: ${e[1]}`).join(", ")}}`;
}
