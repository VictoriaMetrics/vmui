import {TimeParams} from "../types";

export enum TimePreset {
  "lastHour",
  "last15Min",
  "last2Min",
  "last24Hours"
}

export const getTimeperiodForPreset = (p: TimePreset): TimeParams => {
  const n = (new Date()).valueOf() / 1000;
  let delta = 0;
  switch (p) {
    case TimePreset.last2Min:
      delta = 60 * 2;
      break;
    case TimePreset.last15Min:
      delta = 60 * 15;
      break;
    case TimePreset.lastHour:
      delta = 60 * 60;
      break;
    case TimePreset.last24Hours:
      delta = 60 * 60 * 24;
  }

  const MAX_ITEMS_PER_CHART = 300; // TODO: make dependent from screen size
  return {
    start: n - delta,
    end: n,
    step: delta / MAX_ITEMS_PER_CHART
  }
}