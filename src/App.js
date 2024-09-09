import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid2,
  IconButton,
  Link,
  List,
  ListItem,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
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
  const [sortCriterion, setSortCriterion] = useState("name");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
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
        `https://api.spotify.com/v1/search?q=${query}&type=track,artist,album`,
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
      const filteredTracks = data.tracks.items.filter(
        (track) => track.preview_url,
      );
      setResults(filteredTracks);
    } catch (error) {
      console.error("Error fetching data from Spotify API", error);
    }
  };

  const sortMusic = (criterion) => {
    const sortedMusic = [...results].sort((a, b) => {
      if (a[criterion] < b[criterion]) return -1;
      if (a[criterion] > b[criterion]) return 1;
      return 0;
    });
    setResults(sortedMusic);
  };

  const handleSortChange = (criterion) => {
    setSortCriterion(criterion);
    sortMusic(criterion);
  };

  const handlePlayPause = (track) => {
    if (!track.preview_url) return;

    if (selectedTrack?.id === track.id) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (audioElement) audioElement.pause();
      const newAudio = new Audio(track.preview_url);
      setAudioElement(newAudio);
      newAudio.play();
      setSelectedTrack(track);
      setIsPlaying(true);
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
        padding: 2,
        boxShadow: 3,
      }}
    >
      <ThemeProvider theme={theme}>
        <Typography variant="h1" fontSize="4rem">
          Music Search
        </Typography>

        <Box>
          <TextField
            sx={{ m: 1, width: 250, input: { color: "purple" } }}
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

          <Button
            type="button"
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => handleSortChange("name")}
          >
            Sort Music
          </Button>
        </Box>

        <Grid2 sx={{ m: "20px", marginLeft: "5%" }} container spacing={2}>
          {results.map((item, index) => (
            <Grid2 size={{ xs: 8, md: 6 }} spacing={4} item key={item.id}>
              <List className="text" variant="body1">
                <ListItem key={index}>
                  <img
                    src={item.album.images[0]?.url}
                    alt={item.name}
                    width="50"
                    style={{ margin: "5px", borderRadius: "5px" }}
                    loading="lazy"
                  />
                  <Link
                    href={item.external_urls.spotify}
                    color="textPrimary"
                    underline="none"
                  >
                    {item.name} by {item.artists[0].name}
                  </Link>
                  <IconButton onClick={() => handlePlayPause(item)}>
                    {selectedTrack?.id === item.id && isPlaying ? (
                      <PauseIcon />
                    ) : (
                      <PlayArrowIcon />
                    )}
                  </IconButton>
                </ListItem>
              </List>
            </Grid2>
          ))}
        </Grid2>
      </ThemeProvider>
    </Box>
  );
};

export default App;
