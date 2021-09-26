import React, { useEffect } from "react";

function SpotifyLogin() {
  const loginUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&scope=user-top-read&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}`;

  // redirect
  useEffect(() => {
    window.location = loginUrl;
  });

  return <div></div>;
}

export default SpotifyLogin;
