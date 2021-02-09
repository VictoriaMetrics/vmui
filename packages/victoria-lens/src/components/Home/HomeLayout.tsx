import React, {FC} from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  CircularProgress,
  Fade,
  Toolbar,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {ExecutionControls} from "./Configurator/ExecutionControls";
import {DisplayTypeSwitch} from "./Configurator/DisplayTypeSwitch";
import {UrlLine} from "./UrlLine";
import GraphView from "./Views/GraphView";
import TableView from "./Views/TableView";
import {useAppState} from "../../state/StateContext";
import QueryConfigurator from "./Configurator/QueryConfigurator";
import {useFetchQuery} from "./Configurator/useFetchQuery";
import JsonView from "./Views/JsonView";

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
      <Box display="flex" flexDirection="column" style={{height: "calc(100vh - 64px)"}}>
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
        <UrlLine url={fetchUrl}/>
        <Box flexShrink={1} style={{overflowY: "scroll"}}>
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
            {liveData && (displayType === "code") && <JsonView data={liveData}/>}
            {liveData && (displayType === "table") && <TableView data={liveData}/>}
          </Box>}
        </Box>
      </Box>
    </>
  );
};

export default HomeLayout;