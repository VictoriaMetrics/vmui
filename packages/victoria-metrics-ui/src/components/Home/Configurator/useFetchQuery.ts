import {useEffect, useMemo, useState} from "react";
import {getQueryRangeUrl, getQueryUrl} from "../../../api/query-range";
import {useAppState} from "../../../state/StateContext";
import {InstantMetricResult, MetricResult} from "../../../api/types";
import {saveToStorage} from "../../../utils/storage";
import {isValidHttpUrl} from "../../../utils/url";

export const useFetchQuery = (): {
  fetchUrl?: string,
  isLoading: boolean,
  graphData?: MetricResult[],
  liveData?: InstantMetricResult[],
  error?: string
} => {
  const {query, displayType, serverUrl, time: {period}} = useAppState();

  const [isLoading, setIsLoading] = useState(false);
  const [graphData, setGraphData] = useState<MetricResult[]>();
  const [liveData, setLiveData] = useState<InstantMetricResult[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (error) {
      setGraphData(undefined);
      setLiveData(undefined);
    }
  }, [error]);

  const fetchUrl = useMemo(() => {
    if (period) {
      if (!serverUrl) {
        setError("Please enter Server URL");
        return;
      }
      if (!query.trim()) {
        setError("Please enter a valid Query and execute it");
        return;
      }
      if (isValidHttpUrl(serverUrl)) {
        return displayType === "chart"
          ? getQueryRangeUrl(serverUrl, query, period)
          : getQueryUrl(serverUrl, query, period);
      } else {
        setError("Please provide a valid URL");
      }
    }
  },
  [serverUrl, period, displayType]);

  // TODO: this should depend on query as well, but need to decide when to do the request.
  //       Doing it on each query change - looks to be a bad idea. Probably can be done on blur
  useEffect(() => {
    (async () => {
      if (fetchUrl) {
        setIsLoading(true);
        const response = await fetch(fetchUrl);
        if (response.ok) {
          saveToStorage("PREFERRED_URL", serverUrl);
          const resp = await response.json();
          setError(undefined);
          displayType === "chart" ? setGraphData(resp.data.result) : setLiveData(resp.data.result);
        } else {
          setError((await response.json())?.error);
        }
        setIsLoading(false);
      }
    })();
  }, [fetchUrl, serverUrl, displayType]);

  return {
    fetchUrl,
    isLoading,
    graphData,
    liveData,
    error
  };
};