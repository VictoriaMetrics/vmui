export interface MetricBase {
  metric: {
    instance: string;
    job: string;
    type: string;
  };
}

export interface MetricResult extends MetricBase {
  values: [number, string][]
}


export interface InstantMetricResult extends MetricBase {
  value: [number, string]
}

export interface QueryRangeResponse {
  status: string;
  data: {
    result: MetricResult[];
    resultType: "matrix";
  }
}