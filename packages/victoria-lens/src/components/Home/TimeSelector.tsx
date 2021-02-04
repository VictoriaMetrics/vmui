import React, {FC, useEffect, useState} from "react";
import {Box, Link, Popover, TextField, Typography} from "@material-ui/core";
import {TimeDurationPopover} from "./TimeDurationPopover";

interface TimeSelectorProps {
  setDuration: (str: string) => void;
  duration: string;
}

export const TimeSelector: FC<TimeSelectorProps> = ({setDuration, duration}) => {

  const [durationString, setDurationString] = useState<string>(duration);

  const [durationStringFocused, setFocused] = useState(false);

  useEffect(() => {
    if (!durationStringFocused) {
      setDuration(durationString);
    }
  }, [durationString, durationStringFocused])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDurationString(event.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<Element, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // @ts-ignore
  return <Box m={2}>
    <Box>
      <TextField label="Duration" value={durationString} onChange={handleChange}
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
        Possible options<span aria-owns={open ? 'mouse-over-popover' : undefined}
                              aria-haspopup="true"
                              style={{cursor: "pointer"}}
                              onMouseEnter={handlePopoverOpen}
                              onMouseLeave={handlePopoverClose}>�:&nbsp;</span>
        <Popover
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            style={{pointerEvents: "none"}} // important
            onClose={handlePopoverClose}
            disableRestoreFocus
        >
          <TimeDurationPopover/>
        </Popover>
        <Link component="button"
              onClick={() => {
                setDurationString("2m");
              }}>
          2m
        </Link>,&nbsp;
        <Link component="button"
              onClick={() => {
                setDurationString("15m");
              }}>
          15m
        </Link>,&nbsp;
        <Link component="button"
              onClick={() => {
                setDurationString("1h");
              }}>
          1h
        </Link>,&nbsp;
        <Link component="button"
              onClick={() => {
                setDurationString("1h 30m");
              }}>
          1h 30m
        </Link>
      </Typography>
    </Box>

  </Box>
}