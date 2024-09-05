import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  return (
    <>
      <MusicSearch />
    </>
  );
};

const MusicSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  // const [token, setToken] = useState();

  const updateToken = async () => {
    console.log("running");
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
      // console.log(data);
      // console.log(data.access_token);
      localStorage.setItem("token", data.access_token);
    } catch (error) {
      console(error);
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
      // console.log(data.tracks.items);
    } catch (error) {
      console.error("Error fetching data from Spotify API", error);
    }
  };

  return (
    <div className="container">
      <h1>Music Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a Song"
      />
      <button type="button" onClick={searchMusic}>
        Search
      </button>
      <div className="result">
        {results.map((item) => (
          <div key={item.id}>
            <p>
              {item.name} by {item.artists[0].name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
