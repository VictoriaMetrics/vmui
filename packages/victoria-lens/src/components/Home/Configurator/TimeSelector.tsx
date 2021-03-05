import React, {FC, useEffect, useState} from "react";
import {Box, Link, Popover, TextField, Typography} from "@material-ui/core";
import {TimeDurationPopover} from "./TimeDurationPopover";
import {useAppDispatch, useAppState} from "../../../state/StateContext";
import {dateFromSeconds, formatDateForNativeInput} from "../../../utils/time";
import {makeStyles} from "@material-ui/core/styles";

interface TimeSelectorProps {
  setDuration: (str: string) => void;
  duration: string;
}

const useStyles = makeStyles({
  inlineBtn: {
    "&:hover": {
      cursor: "pointer"
    },
  }
});

const InlineBtn: React.FC<{handler: () => void; text: string}> = ({handler, text}) => {
  const classes = useStyles();
  return <Link component="span" className={classes.inlineBtn}
    onClick={handler}>
    {text}
  </Link>;
};

export const TimeSelector: FC<TimeSelectorProps> = ({setDuration}) => {

  const [durationStringFocused, setFocused] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [until, setUntil] = useState<string>();

  const {time: {period: {end}, duration}} = useAppState();

  const dispatch = useAppDispatch();

  const [durationString, setDurationString] = useState<string>(duration);

  useEffect(() => {
    setDurationString(duration);
  }, [duration]);

  useEffect(() => {
    setUntil(formatDateForNativeInput(dateFromSeconds(end)));
  }, [end]);

  useEffect(() => {
    if (!durationStringFocused) {
      setDuration(durationString);
    }
  }, [durationString, durationStringFocused]);

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDurationString(event.target.value);
  };

  const handlePopoverOpen = (event: React.MouseEvent<Element, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return <Box m={1} flexDirection="row" display="flex">
    {/*setup duration*/}
    <Box px={1}>
      <Box>
        <TextField label="Duration" value={durationString} onChange={handleDurationChange}
          fullWidth={true} 
          onBlur={() => {
            setFocused(false);
          }}
          onFocus={() => {
            setFocused(true);
          }}
        />
      </Box>
      <Box my={2}>
        <Typography variant="body2">
          Possible options<span aria-owns={open ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
            style={{cursor: "pointer"}}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}>�:&nbsp;</span>
          <Popover
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            style={{pointerEvents: "none"}} // important
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <TimeDurationPopover/>
          </Popover>
          <InlineBtn handler={() => setDurationString("5m")} text="5m"/>,&nbsp;
          <InlineBtn handler={() => setDurationString("1h")} text="1h"/>,&nbsp;
          <InlineBtn handler={() => setDurationString("1h 30m")} text="1h 30m"/>
        </Typography>
      </Box>
    </Box>
    {/*setup end time*/}
    <Box px={1}>
      <Box>
        <TextField
          type="datetime-local"
          label="Until"
          value={until}
          fullWidth={true}
          inputProps={{step: 1}}
          InputLabelProps={{shrink: true}}
        />
      </Box>

      <Box my={2}>
        <Typography variant="body2">
          Will be changed to current time for auto-refresh mode.&nbsp;
          <InlineBtn handler={() => dispatch({type: "RUN_QUERY_TO_NOW"})} text="Switch to now"/>
        </Typography>
      </Box>
    </Box>
  </Box>;
};