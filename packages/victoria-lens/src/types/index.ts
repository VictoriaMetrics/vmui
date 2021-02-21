export interface TimeParams {
  start: number; // timestamp in seconds
  end: number; // timestamp in seconds
  step?: number; // seconds
}

export interface DataValue {
  key: number; // timestamp in seconds
  value: number; // y axis value
}

export interface DataSeries {
  metadata: {
    name: string;
  }
  values: DataValue[]; // sorted by key which is timestamp
}


export interface InstantDataSeries {
  metadata: string[]; // just ordered columns
  value: string;
}