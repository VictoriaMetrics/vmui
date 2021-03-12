import {DisplayType} from "../components/Home/Configurator/DisplayTypeSwitch";
import {TimeParams, TimePeriod} from "../types";
import {dateFromSeconds, getDurationFromPeriod, getTimeperiodForDuration} from "../utils/time";

export interface TimeState {
  duration: string;
  period: TimeParams;
}

export interface AppState {
  serverUrl: string;
  displayType: DisplayType;
  query: string;
  time: TimeState;
  queryControls: {
    autoRefresh: boolean;
  }
}

export type Action =
    | { type: "SET_DISPLAY_TYPE", payload: DisplayType }
    | { type: "SET_SERVER", payload: string }
    | { type: "SET_QUERY", payload: string }
    | { type: "SET_DURATION", payload: string }
    | { type: "SET_PERIOD", payload: TimePeriod }
    | { type: "RUN_QUERY"}
    | { type: "RUN_QUERY_TO_NOW"}
    | { type: "TOGGLE_AUTOREFRESH"}

export const initialState: AppState = {
  serverUrl: "https://demo.promlabs.com",
  displayType: "chart",
  query: "demo_memory_usage_bytes", // prometheus_http_request_duration_seconds_bucket
  time: {
    duration: "1h",
    period: getTimeperiodForDuration("1h")
  },
  queryControls: {
    autoRefresh: false
  }
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_DISPLAY_TYPE":
      return {
        ...state,
        displayType: action.payload
      };
    case "SET_SERVER":
      return {
        ...state,
        serverUrl: action.payload
      };
    case "SET_QUERY":
      return {
        ...state,
        query: action.payload
      };
    case "SET_DURATION":
      return {
        ...state,
        time: {
          ...state.time,
          duration: action.payload,
          period: getTimeperiodForDuration(action.payload,dateFromSeconds(state.time.period.end))
        }
      };
    case "SET_PERIOD":
      // eslint-disable-next-line no-case-declarations
      const duration = getDurationFromPeriod(action.payload);
      return {
        ...state,
        queryControls: {
          ...state.queryControls,
          autoRefresh: false // since we're considering this to action to be fired from period selection on chart
        },
        time: {
          ...state.time,
          duration,
          period: getTimeperiodForDuration(duration, action.payload.to)
        }
      };
    case "TOGGLE_AUTOREFRESH":
      return {
        ...state,
        queryControls: {
          ...state.queryControls,
          autoRefresh: !state.queryControls.autoRefresh
        }
      };
    case "RUN_QUERY":
      return {
        ...state,
        time: {
          ...state.time,
          period: getTimeperiodForDuration(state.time.duration, dateFromSeconds(state.time.period.end))
        }
      };
    case "RUN_QUERY_TO_NOW":
      return {
        ...state,
        time: {
          ...state.time,
          period: getTimeperiodForDuration(state.time.duration)
        }
      };
    default:
      throw new Error();
  }
}