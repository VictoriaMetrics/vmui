export type AggregatedDataSet = {
  key: string;
  value: aggregatedDataValue;
};
export type aggregatedDataValue = {[key: string]: number};
