import React, { useEffect, useState } from 'react'
import './TicketsDB.css'
import SideBar from '../SideBar'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  TableSortLabel,
  Button,
  Icon,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

const headCells = [
  { id: "id", label: "ID" },
  { id: "eventDate", label: "Event Date" },
  { id: "eventName", label: "Event Name" },
  { id: "eventLocation", label: "Event Location" },
  { id: "issuerName", label: "Issuer Name" },
  { id: "ticketType", label: "Ticket Type" },
];

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ backgroundColor: "#292350", color: "white" }}>
      <TableRow>
        <TableCell />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ color: "white" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};


const Row = (props) => {
  const { row } = props;
  const [dtOpen, setDtOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="medium"
            onClick={() => setDtOpen(!dtOpen)}
            color="inherit"
            sx={{ color: "black", backgroundColor: "black" }}
          >
            <KeyboardArrowDown sx={{ color: "white" }} />
          </IconButton>
        </TableCell>

        <TableCell>{row.id}</TableCell>
        <TableCell>{row.eventName}</TableCell>
        <TableCell>{row.eventDate}</TableCell>
        <TableCell>{row.eventLocation}</TableCell>
        <TableCell>{row.issuerName}</TableCell>
        <TableCell>{row.ticketType}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={dtOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Typography variant="h6" gutterBottom component="div">
                Participant Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableBody>
                  {Object.entries(row)
                    .filter(([key]) =>
                      [
                        "ticketID",
                        "participantName",
                        "address",
                        "imageHash",
                        "jsonFile"
                      ].includes(key)
                    ) // Replace with the keys you want to display
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell
                          sx={{
                            color: "white",
                            backgroundColor: "#292350",
                          }}
                        >
                          {key.toUpperCase()}
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                          }}
                        >
                          {value}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};
const TicketsDB = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [nftDataLength, setNftDataLength] = useState(0);
  const [nftsData, setNftsData] = useState([]);

  useEffect(()=>{
    getMintedNft();
  },[])
  
  const getMintedNft = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:9000/api/mintedData/getMintedData",
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const nftData = await response.json();
        setNftDataLength(nftData.data.length);
        setNftsData(nftData.data);
      }
    } catch (error) {
      console.error("Error fetching NFT data:", error);
    }
  
    setIsLoading(false);
  };
  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, nftDataLength - page * rowsPerPage);
  return (
    <div className="mainDash">
      <div className="dash-header">
        <h4>Welcome to Ticketing System</h4>
      </div>
      <div className="dash2">
        <div className="sidebar">
        <SideBar/>
        </div>
        <div className="content">
        <TableContainer
            sx={{ paddingTop: "10px", marginTop: "15px", overflowX: "unset" }}
            component={Paper}
          >
            <Table aria-label="collapsible table">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(nftsData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <Row key={row.id} row={row}  />
                  ))}
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={5} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="pagination">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            >
              {[5, 20, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <IconButton
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
              disabled={page === 0}
            >
              <KeyboardArrowLeft sx={{ color: "white" }} />
            </IconButton>
            <span>{page + 1}</span>
            <IconButton
              onClick={() =>
                setPage((prevPage) =>
                  Math.min(
                    prevPage + 1,
                    Math.ceil(nftDataLength / rowsPerPage) - 1
                  )
                )
              }
              disabled={page >= Math.ceil(nftDataLength / rowsPerPage) - 1}
            >
              <KeyboardArrowRight sx={{ color: "white" }} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketsDB