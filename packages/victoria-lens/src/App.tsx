import React, {useEffect, useMemo, useState} from 'react';
import QueryEditor from "./components/QueryEditor";
import {MetricResult, QueryRangeResponse} from "./api/types";
import GraphView from "./components/GraphView";
import {AppBar, Box, Grid, TextField, Toolbar, Typography} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {getQueryRange} from "./api/query-range";
import {getTimeperiodForPreset, TimePreset} from "./utils/time";

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
                  onChange={
                    (e, val) =>
                        // Toggle Button Group returns null in case of click on selected element, avoiding it
                        setTimePreset(prev => val ?? prev)
                  }>
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
