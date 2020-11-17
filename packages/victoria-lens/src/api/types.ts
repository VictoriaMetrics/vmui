export interface MetricResult {
  metric: {
    instance: string;
    job: string;
    type: string;
  };
  values: [number, string][]
}

export interface QueryRangeResponse {
  status: string;
  data: {
    result: MetricResult[];
    resultType: "matrix";
  }
}