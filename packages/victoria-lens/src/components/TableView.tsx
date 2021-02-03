import React, {FC, useMemo} from "react";
import {InstantMetricResult} from "../api/types";
import {InstantDataSeries} from "../types";
import {getNameForMetric} from "../utils/metric";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

export interface GraphViewProps {
  data: InstantMetricResult[];
}

const TableView: FC<GraphViewProps> = ({data}) => {

  const rows: InstantDataSeries[] = useMemo(() => {
    return data?.map(d => ({
      metadata: {
        name: getNameForMetric(d),
        instance: d.metric.instance,
        job: d.metric.job,
        type: d.metric.type
      },
      // VM metrics are tuples - much simpler to work with objects in chart
      value: d.value[1]
    }))
  }, [data])

  return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Instance</TableCell>
              <TableCell>Job</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
                <TableRow key={row.metadata.name}>
                  <TableCell>{row.metadata.instance}</TableCell>
                  <TableCell>{row.metadata.job}</TableCell>
                  <TableCell>{row.metadata.type}</TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}

export default TableView;