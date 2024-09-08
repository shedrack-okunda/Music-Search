import React, { useEffect, useState } from "react";
import { Box, Button, Grid2, Link } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography/Typography";
import "@fontsource/roboto";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import "./App.css";

const App = () => {
  return (
    <>
      <MusicSearch />
    </>
  );
};

let theme = createTheme();
theme = responsiveFontSizes(theme);

const MusicSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  // const [token, setToken] = useState();

  const updateToken = async () => {
    try {
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: "6d564beea1cf4c3da710207d7ef04b6a",
          client_secret: "8a7cdc03dd404cf9a773cd7ea54a7f1e",
        }).toString(),
      });
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateToken();
  }, []);

  const token = localStorage.getItem("token");
  // console.log(token);

  const searchMusic = async () => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track`,
        {
          method: "GET",
          body: JSON.stringify(),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setResults(data.tracks.items);
    } catch (error) {
      console.error("Error fetching data from Spotify API", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#76ff03",
        borderRadius: "10px",
      }}
    >
      <ThemeProvider theme={theme}>
        <Typography variant="h1" fontSize="4rem">
          Music Search
        </Typography>
        <TextField
          sx={{ m: 1, width: 300, input: { color: "purple" } }}
          type="text"
          value={query}
          variant="filled"
          onChange={(e) => setQuery(e.target.value)}
          label="Search for a Song"
          size="small"
        />

        <Button
          sx={{ m: 1 }}
          variant="contained"
          color="secondary"
          type="button"
          size="large"
          onClick={searchMusic}
        >
          Search
        </Button>
        <Grid2 sx={{ m: "20px", marginLeft: "5%" }} container spacing={2}>
          {results.map((item) => (
            <Grid2 size={{ xs: 8, md: 6 }} spacing={4} item key={item.id}>
              <Typography className="text" variant="body1">
                <Link
                  href="https://www.spotify.com"
                  color="#000"
                  underline="none"
                >
                  {item.name} by {item.artists[0].name}
                </Link>
              </Typography>
            </Grid2>
          ))}
        </Grid2>
      </ThemeProvider>
    </Box>
  );
};

export default App;
