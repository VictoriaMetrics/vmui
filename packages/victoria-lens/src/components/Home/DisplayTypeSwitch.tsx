import React, {FC} from "react";

import TableChartIcon from "@material-ui/icons/TableChart";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import CodeIcon from '@material-ui/icons/Code';

import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";

export type DisplayType = "table" | "chart" | "code";

interface DisplayTypeSwitchProps {
  type: DisplayType;
  setType: (type: DisplayType) => void;
}

export const DisplayTypeSwitch: FC<DisplayTypeSwitchProps> = ({type, setType}) => {

  return <ToggleButtonGroup
        value={type}
        exclusive
        onChange={
          (e, val) =>
              // Toggle Button Group returns null in case of click on selected element, avoiding it
              setType(val ?? type)
        }>
      <ToggleButton value="chart" aria-label="display as chart">
        <ShowChartIcon/>&nbsp;Query Range as Chart
      </ToggleButton>
      <ToggleButton value="code" aria-label="display as code">
        <CodeIcon/>&nbsp;Instant Query as JSON
      </ToggleButton>
      <ToggleButton value="table" aria-label="display as table">
        <TableChartIcon/>&nbsp;Instant Query as Table
      </ToggleButton>
    </ToggleButtonGroup>
}