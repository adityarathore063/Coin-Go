/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { CoinList } from '../Config/API'
import axios from 'axios'
import { CryptoState } from '../CryptoContext'
import { Container, createTheme, TextField, ThemeProvider, Typography, TableContainer, TableBody, LinearProgress, TableHead, Table, TableRow, TableCell, Paper } from '@material-ui/core'
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinsTable = () => {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1);
    const { currency, symbol } = CryptoState()
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);

    const useStyles = makeStyles({
        row: {
          backgroundColor: "#16171a",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#131111"
          },
          fontFamily: "Montserrat"
        },
        pagination: {
          "& .MuiPaginationItem-root": {
            color: "gold",
            fontWeight: "bold",
            fontFamily: "Montserrat",
            "&:hover": {
              color: "white"
            },
            "&:focus": {
              color: "white"
            }
          }
        }
      });

    const classes = useStyles();
    const history = useHistory();


    const fetchCoinList = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));
    
        setCoins(data);
        setLoading(false);
      };
    useEffect(() => {
        fetchCoinList(); 

    }, [currency]);

    const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

    const darkTheme = createTheme({
        palette: {
          type: 'dark',
        },
      });
    
    return (
        <ThemeProvider theme={darkTheme} >
            <Container style={{ textAlign: "center" }}> 
                <Typography
                    variant= "h4"
                    style={{ margin: 18, fontFamily: "Montserrat" }}
                >
                    Crypto Currency Prices by Market Cap
                    <TextField 
                        label="Search for a Crypto Currency"
                        variant='outlined'
                        style={{ marginBottom: "20", width: "100%", marginTop: "2%"}}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <TableContainer component={Paper} style={{marginTop: "2%"}}>
                    {loading ? (
                        <LinearProgress style={{ backgroundColor: "gold" }} />
                    ) : (
                        <Table aria-label="simple table">
                        <TableHead style={{ backgroundColor: "#EEBC1D", }}>
                            <TableRow>
                            {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                <TableCell
                                style={{
                                    color: "black",
                                    fontWeight: "700",
                                    fontFamily: "Montserrat",
                                    fontSize: "50%"
                                }}
                                key={head}
                                align={head === "Coin" ? "" : "right"}
                                >
                                {head}
                                </TableCell>
                            ))}
                            </TableRow>
                        </TableHead>

                        <TableBody> 
                            {handleSearch()
                            .slice((page - 1) * 10, (page - 1) * 10 + 10)
                            .map((row) => {
                                const profit = row.price_change_percentage_24h > 0;
                                return (
                                <TableRow
                                    onClick={() => history.push(`/coins/${row.id}`)}
                                    className={classes.row}
                                    key={row.name}
                                >
                                    <TableCell
                                    component="th"
                                    scope="row"
                                    style={{
                                        display: "flex",
                                        gap: 15,
                                    }}
                                    >
                                    <img
                                        src={row?.image}
                                        alt={row.name}
                                        height="50"
                                        style={{ marginBottom: 10 }}
                                    />
                                    <div
                                        style={{ display: "flex", flexDirection: "column" }}
                                    >
                                        <span
                                        style={{
                                            textTransform: "uppercase",
                                            fontSize: 22,
                                            color: "white",
                                            fontFamily: "Montserrat",
                                            fontWeight: "bold"
                                        }}
                                        >
                                        {row.symbol}
                                        </span>
                                        <span style={{ color: "white", fontFamily: "Montserrat" }}>
                                        {row.name}
                                        </span>
                                    </div>
                                    </TableCell>
                                    <TableCell align="right" style={{color: "white", fontWeight: "bold", fontFamily: "Montserrat"}}>
                                    {symbol}{" "}
                                    {numberWithCommas(row.current_price.toFixed(2))}
                                    </TableCell>
                                    <TableCell
                                    align="right"
                                    style={{
                                        color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                                        fontWeight: 500,
                                        fontFamily: "Montserrat"
                                    }}
                                    >
                                    {profit && "+"}
                                    {row.price_change_percentage_24h.toFixed(2)}%
                                    </TableCell>
                                    <TableCell align="right" style={{color: "white", fontWeight: "bold", fontFamily: "Montserrat"}}>
                                    {symbol}{" "}
                                    {numberWithCommas(
                                        row.market_cap.toString().slice(0, -6)
                                    )}
                                    M
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </TableBody>
                        </Table>
                    )}
                    </TableContainer>
                </Typography>

                <Pagination
                    count={(handleSearch()?.length / 10).toFixed(0)}
                    style={{
                        padding: 20,
                        width: "auto",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    classes={{ ul: classes.pagination }}
                    onChange={(_, value) => {
                        setPage(value);
                        window.scroll(0, 450);
                    }}
                />
            </Container>
        </ThemeProvider>
    )
}

export default CoinsTable