import React, {FC, useMemo} from "react";
import {InstantMetricResult} from "../api/types";
import {InstantDataSeries} from "../types";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export interface GraphViewProps {
  data: InstantMetricResult[];
}

const useStyles = makeStyles({
  deemphasized: {
    opacity: 0.4
  }
});

const TableView: FC<GraphViewProps> = ({data}) => {

  const classes = useStyles();

  const sortedColumns = useMemo(() => {
    const columns: { [key: string]: { options: Set<string> } } = {};
    data.forEach(d =>
        Object.entries(d.metric).forEach(e =>
            columns[e[0]] ? columns[e[0]].options.add(e[1]) : columns[e[0]] = {options: new Set([e[1]])}
        )
    );

    return Object.entries(columns).map(e => ({
      key: e[0],
      variations: e[1].options.size
    })).sort((a1, a2) => a1.variations - a2.variations)
  }, [data])

  const rows: InstantDataSeries[] = useMemo(() => {
    return data?.map(d => ({
      metadata: sortedColumns.map(c => d.metric[c.key] || "-"),
      value: d.value[1]
    }))
  }, [sortedColumns, data])

  return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {sortedColumns.map((col, index) => (
                  <TableCell style={{textTransform: "capitalize"}} key={index}>{col.key}</TableCell>))}
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
                <TableRow key={index}>
                  {row.metadata.map((rowMeta, index2) => {
                        const prevRowValue = rows[index - 1] && rows[index - 1].metadata[index2];
                        return (
                            <TableCell className={prevRowValue === rowMeta ? classes.deemphasized : undefined}
                                       key={index2}>{rowMeta}</TableCell>
                        )
                      }
                  )}
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}

export default TableView;