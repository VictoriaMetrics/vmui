import React, {FC} from "react";
import {Checkbox, FormControlLabel, Typography} from "@material-ui/core";

export interface LegendItem {
  label: string;
  color: string;
  checked: boolean;
}

export interface LegendProps {
  labels: LegendItem[];
  onChange: (index: number) => void;
}

export const Legend: FC<LegendProps> = ({labels, onChange}) => {

  return <div>
    {labels.map((legendItem: LegendItem, index) =>
      <div key={legendItem.label}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={legendItem.checked}
              onChange={() => {
                onChange(index);
              }}
              style={{
                color: legendItem.color,
              }}
            />
          }
          label={<Typography variant="body2">{legendItem.label}</Typography>}
        />
      </div>
    )}
  </div>;
};