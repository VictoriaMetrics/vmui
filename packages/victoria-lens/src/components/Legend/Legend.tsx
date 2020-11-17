import React, {FC} from "react";
import {ScaleOrdinal} from "d3";

export interface LegendProps {
  names: string[];
  color: ScaleOrdinal<string, string> // maps name to color hex code
}

export const Legend: FC<LegendProps> = ({names, color}) => {
  return <div>
    {names.map((name: string) =>
        <div key={name} style={{display: "flex", flexDirection: "row", paddingTop: "5px"}}>
          <div style={{width: "1em", height: "1em", backgroundColor: color(name), marginRight: "5px"}}></div>
          <div>{name}</div>
        </div>
    )}
  </div>
}