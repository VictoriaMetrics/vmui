import React from "react";
import {Box, makeStyles, Typography} from "@material-ui/core";

export interface ChartTooltipData {
  value: number;
  name: string;
  color?: string;
}

export interface ChartTooltipProps {
  data: ChartTooltipData[];
  time?: Date;
}

const useStyle = makeStyles(() => ({
  wrapper: {
    width: "40vw"
  }
}));

export const ChartTooltip: React.FC<ChartTooltipProps> = ({data, time}) => {
  const classes = useStyle();

  return (
    <Box px={1} className={classes.wrapper}>
      <Box>
        <Typography variant="subtitle1">{`${time?.toLocaleDateString()} ${time?.toLocaleTimeString()}`}</Typography>
      </Box>
      <Box component={"div"}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>
    </Box>
  );
};