const axios = require("axios");
const qs = require("qs");

const client_id = "52cc8f09aadc408e80428500ec5f9e34";
const client_secret = "cfcaec7058d7443a86a7c7b391df5a03";

const getSpotifyToken = async () => {
  const token = Buffer.from(`${client_id}:${client_secret}`, "utf-8").toString(
    "base64",
  );
  const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
    grant_type: 
  }))
};
