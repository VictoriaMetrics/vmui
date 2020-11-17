import React, {useCallback, useEffect, useMemo, useState} from 'react';
import QueryEditor from "./components/QueryEditor";
import {MetricResult, QueryRangeResponse} from "./api/types";
import GraphView from "./components/GraphView";

export enum TimePreset {
  "lastHour",
  "last15Min"
};

const getTimeperiodForPreset = (p: TimePreset) => {
  const n = (new Date()).valueOf() / 1000;
  const delta = (p === TimePreset.lastHour ? 60 : 15) * 60;
  return {
    start: n - delta,
    end: n
  }
}

function App() {

  const [timePreset, setTimePreset] = useState<TimePreset>(TimePreset.lastHour);

  const [server, setServer] = useState("http://127.0.0.1:8428");
  const [query, setQuery] = useState("rate(vm_cache_size_bytes[5m])");

  const [graphData, setGraphData] = useState<MetricResult[]>();

  const period = useMemo(() => {
    return getTimeperiodForPreset(timePreset)
  }, [timePreset])

  const onSubmitHandler = async () => {
    let response = await fetch(`${server}/api/v1/query_range?query=${query}&start=${period.start}&end=${period.end}&step=15s`);
    if (response.ok) {
      const resp: QueryRangeResponse = await response.json();
      setGraphData(resp.data.result);
    } else {
      alert((await response.json())?.error);
    }
  };

  return (
    <div className="page-wrapper">
      <header>
        <h1>
          Victoria Lens
        </h1>
      </header>
      <input type="text" value={server} onChange={(e) => setServer(e.target.value)}/>
      <QueryEditor query={query} setQuery={setQuery}/>


      <u onClick={() => setTimePreset(TimePreset.lastHour)}>Last Hour</u>

      <br/>

      <u onClick={() => setTimePreset(TimePreset.last15Min)}>Last 15 Minutes</u>

      <br/>

      <button onClick={onSubmitHandler}>Query</button>

      {graphData && <GraphView data={graphData} timePresets={period}></GraphView>}
    </div>
  );
}

export default App;
