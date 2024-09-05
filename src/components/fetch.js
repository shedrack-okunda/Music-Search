// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQBqisgcJXhZo_XEO5Noy9Fo1vmsOUPNXRtwyDaV6Rz4qyggKsSuFoJ9XCGLHVPuQzt0GqUsg_Afs6DsEmIvY6WURWcS88ruq7BO_l-4Fnw5hGBjS2XMf7qqN9f5HgPH0hqe4P26yoqeXdSze0xrfYRJlIKHxBJg12q-m98nahUpHOT51kQgkDiW-Xt0kZ3F3QZAKcQ1uGnyT-3Dy9rtxN-EblgmoDqd5a20L9OY6leauFgtjzjWz2caxf8rlJADzjqduB6SvEWaZykUumvKRAQGBzh7Wq4C';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);