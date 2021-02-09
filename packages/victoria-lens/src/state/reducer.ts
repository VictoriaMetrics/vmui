import {DisplayType} from "../components/Home/Configurator/DisplayTypeSwitch";

export interface TimeState {
  duration: string; // period should be obtained from duration in a selector'ish manner
}

export interface AppState {
  serverUrl: string;
  displayType: DisplayType;
  query: string;
  time: TimeState;
}

export type Action =
    | { type: "SET_DISPLAY_TYPE", payload: DisplayType }
    | { type: "SET_SERVER", payload: string }
    | { type: "SET_QUERY", payload: string }
    | { type: "SET_DURATION", payload: string }

export const initialState: AppState = {
  serverUrl: "http://127.0.0.1:8428",
  displayType: "chart",
  query: "rate(\n\t\tvm_cache_size_bytes[5m]\n)",
  time: {
    duration: "1h"
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
          duration: action.payload
        }
      };
    default:
      throw new Error();
  }
}