import React, {FC, useEffect, useMemo, useState} from "react";
import QueryEditor from "./components/QueryEditor";
import {InstantMetricResult, MetricResult} from "./api/types";
import GraphView from "./components/GraphView";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  CircularProgress,
  Fade,
  Grid,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import {getQueryRangeUrl, getQueryUrl} from "./api/query-range";
import {UrlLine} from "./components/Home/UrlLine";
import {SnackbarProvider} from "./contexts/Snackbar";
import {DisplayType, DisplayTypeSwitch} from "./components/Home/DisplayTypeSwitch";
import {TimeSelector} from "./components/Home/TimeSelector";
import TableView from "./components/TableView";
import {TimeParams} from "./types";
import {ExecutionControls} from "./components/Home/ExecutionControls";
import {getTimeperiodForDuration} from "./utils/time";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const App: FC = () => {

  const [type, setType] = useState<DisplayType>("chart");

  const [isLoading, setIsLoading] = useState(false);
  const [run, setRun] = useState(false);

  const [server, setServer] = useState("http://127.0.0.1:8428");
  const [query, setQuery] = useState("rate(\n\t\tvm_cache_size_bytes[5m]\n)");

  const [graphData, setGraphData] = useState<MetricResult[]>();
  const [liveData, setLiveData] = useState<InstantMetricResult[]>();

  const [period, setPeriod] = useState<TimeParams>();
  const [duration, setDuration] = useState<string>("1h");


  // TODO: this should depend on query as well, but need to decide when to do the request.
  //       Doing it on each query change - looks to be a bad idea. Probably can be done on blur
  const fetchUrl = useMemo(() => {
    if (period) {
      return type === "chart"
        ? getQueryRangeUrl(server, query, period)
        : getQueryUrl(server, query, period);
    }
  },
  [server, period, type, run]);

  useEffect(() => {
    (async () => {
      if (fetchUrl) {
        setIsLoading(true);
        const response = await fetch(fetchUrl);
        if (response.ok) {
          const resp = await response.json();
          type === "chart" ? setGraphData(resp.data.result) : setLiveData(resp.data.result);
        } else {
          alert((await response.json())?.error);
        }
        setIsLoading(false);
      }
    })();
  }, [fetchUrl, type]);

  const onRunHandler = () => {
    setRun(prev => !prev); // TODO: be smarter than that
  };

  useEffect(() => {
    setPeriod(getTimeperiodForDuration(duration));
  }, [duration, run]);

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

            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6" component="h2">Query Configuration</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Box py={2}>
                        <TextField variant="outlined" fullWidth label="Server URL" value={server}
                          inputProps={{
                            style: {fontFamily: "Monospace"}
                          }}
                          onChange={(e) => setServer(e.target.value)}/>
                      </Box>
                      <QueryEditor server={server} query={query} setQuery={setQuery}/>

                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box style={{
                      borderRadius: "4px",
                      borderColor: "#b9b9b9",
                      borderStyle: "solid",
                      borderWidth: "1px",
                      height: "calc(100% - 18px)",
                      marginTop: "16px"
                    }}>
                      <TimeSelector setDuration={setDuration} duration={duration}/>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Box mt={2} display="flex" justifyContent="space-between">
              <ExecutionControls onRun={onRunHandler}/>
              <DisplayTypeSwitch type={type} setType={setType}/>
            </Box>
          </Box>
        </Grid>

        <UrlLine url={fetchUrl}/>

        <Grid item xs={12}>
          {isLoading && <Fade in={isLoading} style={{
            transitionDelay: isLoading ? "300ms" : "0ms",
          }}>
            <Box alignItems="center" flexDirection="column" display="flex"
              style={{
                width: "100%",
                position: "absolute",
                height: "150px",
                background: "linear-gradient(rgba(255,255,255,.7), rgba(255,255,255,.7), rgba(255,255,255,0))"
              }} m={2}>
              <CircularProgress/>
            </Box>
          </Fade>}
          {<Box p={2}>
            {graphData && period && (type === "chart") &&
              <GraphView data={graphData} timePresets={period}></GraphView>}
            {liveData && (type === "code") && <pre>{JSON.stringify(liveData, null, 2)}</pre>}
            {liveData && (type === "table") && <TableView data={liveData}/>}
          </Box>}

        </Grid>
      </Grid>
    </SnackbarProvider>
  );
};

export default App;
