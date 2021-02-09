import React, {FC} from "react";

import TableChartIcon from "@material-ui/icons/TableChart";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import CodeIcon from "@material-ui/icons/Code";

import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {useAppDispatch, useAppState} from "../../../state/StateContext";

export type DisplayType = "table" | "chart" | "code";

export const DisplayTypeSwitch: FC = () => {

  const {displayType} = useAppState();
  const dispatch = useAppDispatch();

  return <ToggleButtonGroup
    value={displayType}
    exclusive
    onChange={
      (e, val) =>
      // Toggle Button Group returns null in case of click on selected element, avoiding it
        dispatch({type: "SET_DISPLAY_TYPE", payload: val ?? displayType})
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
  </ToggleButtonGroup>;
};