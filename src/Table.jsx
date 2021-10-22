import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

const columns = [
  { id: "State", label: "State", minWidth: 170 },
  { id: "Confirmed", label: "Confirmed", minWidth: 100 },
  {
    id: "Recovered",
    label: "Recovered",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "Deaths",
    label: "Deaths",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "Active",
    label: "Active",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "Updated",
    label: "Updated",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US")
  }
];

function createData(State, Confirmed, Recovered, Deaths, Active, Updated) {
  return { State, Confirmed, Recovered, Deaths, Active, Updated };
}

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  }
});

export default function StickyHeadTable() {
  const [data, setData] = useState([]);

  const getCovidData = async () => {
    const res = await fetch("https://data.covid19india.org/data.json");
    const actualData = await res.json();
    setData(actualData.statewise);
  };

  useEffect(() => {
    getCovidData();
  }, []);

  const rows = data.map((val, i) => {
    return createData(
      val.state,
      val.confirmed,
      val.recovered,
      val.deaths,
      val.active,
      val.lastupdatedtime
    );
  });
  rows.splice(31, 1);

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
