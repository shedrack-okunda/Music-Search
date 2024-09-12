import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Grid2,
  Link,
} from "@mui/material";
import { ListItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import "@fontsource/roboto";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import "./App.css";
import { Search } from "@mui/icons-material";

const App = () => {
  return (
    <>
      <MusicSearch />
    </>
  );
};

const drawerWidth = 240;
const navItems = ["Artists", "Tracks", "Albums"];

let theme = createTheme();
theme = responsiveFontSizes(theme);

function MusicSearch(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    const updateToken = async () => {
      try {
        const res = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
          }).toString(),
        });
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
      } catch (error) {
        console.error(error);
      }
    };

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

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Music
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Music Search
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              sx={{
                m: 1,
                width: { xs: "130px", sm: "300px" },
                input: {
                  color: "lightgray",
                },
                label: {
                  color: "lightgray",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#888",
                    },
                    "&:hover fieldset": { borderColor: "#aaa" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00aaff",
                    },
                  },
                },
              }}
              type="text"
              variant="filled"
              label="Search..."
              size="small"
              color="lightgray"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              sx={{ m: 1 }}
              variant="contained"
              color="success"
              type="button"
              size="large"
              onClick={searchMusic}
              startIcon={<Search />}
            >
              Search
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <ThemeProvider theme={theme}>
          <Grid2 sx={{ m: "20px" }} container spacing={2}>
            {results.map((item, index) => (
              <Grid2
                xs={12}
                sm={8}
                md={6}
                lg={10}
                spacing={4}
                item
                key={item.id}
              >
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
                      color="white"
                      underline="none"
                    >
                      {item.name} by {item.artists[0].name}
                    </Link>
                    <IconButton onClick={() => handlePlayPause(item)}>
                      {selectedTrack?.id === item.id && isPlaying ? (
                        <PauseIcon color="success" />
                      ) : (
                        <PlayArrowIcon color="success" />
                      )}
                    </IconButton>
                  </ListItem>
                </List>
              </Grid2>
            ))}
          </Grid2>
        </ThemeProvider>
      </Box>
    </Box>
  );
}

MusicSearch.propTypes = {
  window: PropTypes.func,
};

export default App;
