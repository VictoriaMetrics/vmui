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
    maxWidth: "40vw"
  }
}));

export const ChartTooltip: React.FC<ChartTooltipProps> = ({data, time}) => {
  const classes = useStyle();

  return (
    <Box px={1} className={classes.wrapper}>
      <Box fontStyle="italic" mb={.5}>
        <Typography variant="subtitle1">{`${time?.toLocaleDateString()} ${time?.toLocaleTimeString()}`}</Typography>
      </Box>
      <Box>
        <Typography variant="body2">
          {data.map(({name, color,value}) =>
            <Box mb={.25} key={name} display="flex" flexDirection="row" alignItems="center">
              <div style={{backgroundColor: color, width: "10px", height: "10px", marginRight: "4px"}}></div>
              {value}
            </Box>)}
        </Typography>
      </Box>
    </Box>
  );
};