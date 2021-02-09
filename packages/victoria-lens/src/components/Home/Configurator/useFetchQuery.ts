import {useEffect, useMemo, useState} from "react";
import {getQueryRangeUrl, getQueryUrl} from "../../../api/query-range";
import {useAppState} from "../../../state/StateContext";
import {InstantMetricResult, MetricResult} from "../../../api/types";

export const useFetchQuery = (): {
  fetchUrl?: string,
  isLoading: boolean,
  graphData?: MetricResult[],
  liveData?: InstantMetricResult[]
} => {
  const {query, displayType, serverUrl, time: {period}} = useAppState();

  const [isLoading, setIsLoading] = useState(false);
  const [graphData, setGraphData] = useState<MetricResult[]>();
  const [liveData, setLiveData] = useState<InstantMetricResult[]>();

  const fetchUrl = useMemo(() => {
    if (period) {
      return displayType === "chart"
        ? getQueryRangeUrl(serverUrl, query, period)
        : getQueryUrl(serverUrl, query, period);
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
          const resp = await response.json();
          displayType === "chart" ? setGraphData(resp.data.result) : setLiveData(resp.data.result);
        } else {
          alert((await response.json())?.error);
        }
        setIsLoading(false);
      }
    })();
  }, [fetchUrl, displayType]);

  return {
    fetchUrl,
    isLoading,
    graphData,
    liveData
  };
};