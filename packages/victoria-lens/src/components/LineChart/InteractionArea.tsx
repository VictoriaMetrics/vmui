/* eslint max-lines: ["error", {"max": 200}] */ // Complex D3 logic here - file can be larger
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {bisector, brushX, pointer as d3Mouse, ScaleLinear, ScaleTime, select as d3Select, timeDay} from "d3";
import {AggregatedDataSet} from "./model";
import {DataValue} from "../../types";

export type InteractionType = number | [number, number]; // timestamp is single date and 2 timestamps for period

interface LineI {
  yScale: ScaleLinear<number, number>;
  xScale: ScaleTime<number, number>;
  dataForChart: DataValue[];
  onInteraction: (key: InteractionType | undefined) => void; // key is "01/01/2020". undefined means no interaction
}

export const InteractionArea: React.FC<LineI> = ({yScale, xScale, dataForChart, onInteraction}) => {
  const refBrush = useRef<SVGGElement>(null);

  const [currentActivePoint, setCurrentActivePoint] = useState<InteractionType>();
  const [isBrushed, setIsBrushed] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
  function brushEnded(this: any, event: any) {
    const selection = event.selection;
    if (selection) {
      const interval = timeDay.every(1);
      if (!event.sourceEvent) return; // see comment in brushstarted
      // eslint-disable-next-line
      // @ts-ignore
      const [x0, x1] = selection.map((d) => interval.round(xScale.invert(d)));
      d3Select(this)
        .transition()
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        .call(brush.move, x1 > x0 ? [x0, x1].map(xScale) : null);

      setIsBrushed(true);
      setCurrentActivePoint([x0, x1]);
    } else {
      // end event with empty selection means that we're cancelling brush
      setIsBrushed(false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const brushStarted = (event: any): void => {
    // first of all: event is a d3 global value that stores current event (sort of).
    // This is weird but this is how d3 works with events.
    //This check is important:
    // Inside brushended - we have .call(brush.move, ...) in order to snap selected range to dates
    // that internally calls brushstarted again. But in this case sourceEvent is null, since the call
    // is programmatic. If we do not need to adjust selected are - no need to have this check (probably)
    if (event.sourceEvent) {
      setCurrentActivePoint(undefined);
    }
  };

  const brush = useMemo(
    () =>
      brushX()
        .extent([
          [0, 0],
          [xScale.range()[1], yScale.range()[0]]
        ])
        .on("end", brushEnded)
        .on("start", brushStarted),
    [brushEnded, xScale, yScale]
  );

  const resetBrushHandler = useCallback(
    (e) => {
      const el = e.target as HTMLElement;
      if (
        el &&
        el.tagName !== "rect" &&
        e.target.classList.length &&
        !e.target.classList.contains("selection") &&
        currentActivePoint
      ) {
        setCurrentActivePoint(undefined);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        d3Select(refBrush.current).call(brush.move as any, null);
      }
    },
    [brush.move, currentActivePoint]
  );

  useEffect(() => {
    window.addEventListener("click", resetBrushHandler);
    return () => {
      window.removeEventListener("click", resetBrushHandler);
    };
  }, [resetBrushHandler]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bisect = bisector((d: AggregatedDataSet) => new Date(d.key)).left;
    const defineActivePoint = (mx: number): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const date = xScale.invert(mx); // date is a Date object
      // const index = bisect(dataForChart, date, 1);
      // const leftPointKey = dataForChart[index - 1].key; // "01/01/2020"
      // const rightPointKey = dataForChart[index] ? dataForChart[index].key : leftPointKey; // for rightmost part of chart
      // const leftPointX = xScale(new Date(leftPointKey));
      // const rightPointy = xScale(new Date(rightPointKey));
      // const closestDate = mx - leftPointX > rightPointy - mx ? rightPointKey : leftPointKey;

      setCurrentActivePoint(dataForChart[0].key);
    };

    d3Select(refBrush.current)
      .on("touchmove mousemove", function () {
        const coords: [number, number] = d3Mouse(this as never); // d3 uses context to populate mouse event coordinates
        if (!isBrushed) {
          defineActivePoint(coords[0]);
        }
      })
      .on("mouseout", function () {
        if (!isBrushed) {
          setCurrentActivePoint(undefined);
        }
      });
  }, [xScale, dataForChart, isBrushed]);

  useEffect(() => {
    onInteraction(currentActivePoint);
  }, [currentActivePoint, onInteraction]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    brush && xScale && d3Select(refBrush.current).call(brush);
  }, [xScale, brush]);

  return (
    <>
      <g ref={refBrush} />
    </>
  );
};
