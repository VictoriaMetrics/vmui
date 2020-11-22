import React, {useEffect, useMemo, useState} from 'react';
import QueryEditor from "./components/QueryEditor";
import {MetricResult, QueryRangeResponse} from "./api/types";
import GraphView from "./components/GraphView";
import {AppBar, Box, Grid, TextField, Toolbar, Typography} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {TimeParams} from "./types";
import {getQueryRange} from "./api/query-range";

export enum TimePreset {
  "lastHour",
  "last15Min",
  "last2Min",
  "last24Hours"
};

const getTimeperiodForPreset = (p: TimePreset): TimeParams => {
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

function App() {

  const [timePreset, setTimePreset] = useState<TimePreset>(TimePreset.lastHour);

  const [server, setServer] = useState("http://127.0.0.1:8428");
  const [query, setQuery] = useState("rate(vm_cache_size_bytes[5m])");

  const [graphData, setGraphData] = useState<MetricResult[]>();

  const period = useMemo(() => {
    return getTimeperiodForPreset(timePreset)
  }, [timePreset])

  useEffect(() => {
    (async () => {
      let response = await getQueryRange(server, query, period);
      if (response.ok) {
        const resp: QueryRangeResponse = await response.json();
        setGraphData(resp.data.result);
      } else {
        alert((await response.json())?.error);
      }})()
  }, [timePreset]);

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
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4">
              Victoria Lens
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={0}>
          <Grid item xs={6} md={4}>
            <Box m={2}>
              <TextField fullWidth label="Server URL" value={server} onChange={(e) => setServer(e.target.value)}/>
            </Box>
            <Box m={2}>
              <ToggleButtonGroup
                  value={timePreset}
                  exclusive
                  onChange={(e, val) => setTimePreset(val)}>
                <ToggleButton value={TimePreset.last2Min} aria-label="last 2 min">
                  2 min
                </ToggleButton>
                <ToggleButton value={TimePreset.last15Min} aria-label="last 15 min">
                  15 min
                </ToggleButton>
                <ToggleButton value={TimePreset.lastHour} aria-label="last hour">
                  1 hr
                </ToggleButton>
                <ToggleButton value={TimePreset.last24Hours} aria-label="last 24 hours">
                  24 hrs
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
          <Grid item xs={6} md={8}>
            <Box m={2}>
              <Typography variant="body1">The Query</Typography>
              <QueryEditor server={server} query={query} setQuery={setQuery}/>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box p={2}>
              {graphData && <GraphView data={graphData} timePresets={period}></GraphView>}
            </Box>
          </Grid>
        </Grid>
      </>
  );
}

export default App;
