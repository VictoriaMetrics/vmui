import React, {FC, useEffect, useState} from "react";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {getTimeperiodForPreset, TimePreset} from "../../utils/time";
import {TimeParams} from "../../types";
import {Box} from "@material-ui/core";

interface TimeSelectorProps {
  period?: TimeParams;
  setPeriod: (preset: TimeParams) => void;
}

export const TimeSelector: FC<TimeSelectorProps> = ({period, setPeriod}) => {

  const [timePreset, setTimePreset] = useState<TimePreset>(TimePreset.lastHour);

  useEffect(() => {
    setPeriod(getTimeperiodForPreset(timePreset))
  }, [timePreset])

  return <Box m={2}>
    <ToggleButtonGroup
        value={timePreset}
        exclusive
        onChange={
          (e, val) =>
              // Toggle Button Group returns null in case of click on selected element, avoiding it
              setTimePreset(val ?? timePreset)
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
}