import React, {FC} from "react";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {TimePreset} from "../../utils/time";

interface TimeSelectorProps {
  timePreset: TimePreset;
  setTimePreset: (preset: TimePreset) => void;
}

export const TimeSelector: FC<TimeSelectorProps> = ({timePreset, setTimePreset}) => {

  return <ToggleButtonGroup
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
}