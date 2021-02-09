import React, {FC} from "react";
import {Box, Grid, TextField} from "@material-ui/core";
import QueryEditor from "../../QueryEditor";
import {TimeSelector} from "./TimeSelector";
import {useAppDispatch, useAppState} from "../../../state/StateContext";

const QueryConfigurator: FC = () => {

  const {serverUrl, query, time: {duration}} = useAppState();
  const dispatch = useAppDispatch();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Box>
          <Box py={2}>
            <TextField variant="outlined" fullWidth label="Server URL" value={serverUrl}
              inputProps={{
                style: {fontFamily: "Monospace"}
              }}
              onChange={(e) => dispatch({type: "SET_SERVER", payload: e.target.value})}/>
          </Box>
          <QueryEditor server={serverUrl} query={query} setQuery={(query) => dispatch({type: "SET_QUERY", payload: query})}/>

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
          <TimeSelector setDuration={(dur) => dispatch({type: "SET_DURATION", payload: dur})} duration={duration}/>
        </Box>
      </Grid>
    </Grid>
  );
};

export default QueryConfigurator;