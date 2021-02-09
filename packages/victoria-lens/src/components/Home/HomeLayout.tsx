import React, {FC} from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  CircularProgress,
  Fade,
  Grid,
  Toolbar,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {ExecutionControls} from "./Configurator/ExecutionControls";
import {DisplayTypeSwitch} from "./Configurator/DisplayTypeSwitch";
import {UrlLine} from "./UrlLine";
import GraphView from "../GraphView";
import TableView from "../TableView";
import {useAppState} from "../../state/StateContext";
import QueryConfigurator from "./Configurator/QueryConfigurator";
import {useFetchQuery} from "./Configurator/useFetchQuery";

const HomeLayout: FC = () => {

  const {displayType, time: {period}} = useAppState();

  const {fetchUrl, isLoading, liveData, graphData} = useFetchQuery();

  return (
    <>
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
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6" component="h2">Query Configuration</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <QueryConfigurator/>
              </AccordionDetails>
            </Accordion>

            <Box mt={2} display="flex" justifyContent="space-between">
              <ExecutionControls/>
              <DisplayTypeSwitch/>
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
            {graphData && period && (displayType === "chart") &&
              <GraphView data={graphData} timePresets={period}></GraphView>}
            {liveData && (displayType === "code") && <pre>{JSON.stringify(liveData, null, 2)}</pre>}
            {liveData && (displayType === "table") && <TableView data={liveData}/>}
          </Box>}
        </Grid>
      </Grid>
    </>
  );
};

export default HomeLayout;