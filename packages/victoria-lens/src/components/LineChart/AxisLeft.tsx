import React, {useEffect, useRef} from "react";
import {axisLeft, ScaleLinear, select as d3Select} from "d3";
import {format as d3Format} from "d3-format";

interface AxisLeftI {
  yScale: ScaleLinear<number, number>;
  label: string;
}

export const AxisLeft: React.FC<AxisLeftI> = ({yScale, label}) => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<SVGSVGElement | any>(null);
  useEffect(() => {
    yScale && d3Select(ref.current).call(axisLeft(yScale).tickFormat(val => d3Format(".2s")(+val)));
  }, [yScale]);
  return (
    <>
      <g className="y axis" ref={ref} />
      {label && (
        <text style={{fontSize: "0.6rem"}} transform="translate(0,-2)">
          {label}
        </text>
      )}
    </>
  );
};
