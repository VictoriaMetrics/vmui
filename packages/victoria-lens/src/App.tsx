import React, {useEffect, useMemo, useState} from 'react';
import QueryEditor from "./components/QueryEditor";
import {MetricResult, QueryRangeResponse} from "./api/types";
import GraphView from "./components/GraphView";
import {AppBar, Box, Card, CardContent, Grid, TextField, Toolbar, Typography} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {getQueryRangeUrl} from "./api/query-range";
import {getTimeperiodForPreset, TimePreset} from "./utils/time";
import {UrlLine} from "./components/Home/UrlLine";
import {SnackbarProvider} from "./contexts/Snackbar";

function App() {

  const [timePreset, setTimePreset] = useState<TimePreset>(TimePreset.lastHour);

  const [server, setServer] = useState("http://127.0.0.1:8428");
  const [query, setQuery] = useState("rate(\n\t\tvm_cache_size_bytes[5m]\n)");

  const [graphData, setGraphData] = useState<MetricResult[]>();

  const period = useMemo(() => {
    return getTimeperiodForPreset(timePreset)
  }, [timePreset])

  // TODO: this should depend on query as well, but need to decide when to do the request.
  //       Doing it on each query change - looks to be a bad idea. Probably can be done on blur
  const fetchUrl = useMemo(() => getQueryRangeUrl(server, query, period), [server, period])

  useEffect(() => {
    (async () => {
      let response = await fetch(fetchUrl);
      if (response.ok) {
        const resp: QueryRangeResponse = await response.json();
        setGraphData(resp.data.result);
      } else {
        alert((await response.json())?.error);
      }
    })()
  }, [fetchUrl]);

  return (
      <SnackbarProvider>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5">
              Victoria Lens
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box m={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Query Configuration
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <Box m={2}>
                        <Box py={2}>
                          <TextField fullWidth placeholder="Server URL" value={server}
                                     onChange={(e) => setServer(e.target.value)}/>
                        </Box>
                        <QueryEditor server={server} query={query} setQuery={setQuery}/>

                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box m={2}>
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
                      </Box>
                    </Grid>
                  </Grid>

                </CardContent>
              </Card>
            </Box>
          </Grid>

          <UrlLine url={fetchUrl} />

          <Grid item xs={12}>
            <Box p={2}>
              {graphData && <GraphView data={graphData} timePresets={period}></GraphView>}
            </Box>
          </Grid>
        </Grid>
      </SnackbarProvider>
  );
}

export default App;
