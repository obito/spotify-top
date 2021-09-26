import React from "react";
import qs from "qs";
import Tabs from "./components/Tabs";

const tokenURL = "https://accounts.spotify.com/api/token";

class Callback extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      u_name: "",
      u_artistMediumTop: [],
      u_artistShortTop: [],
      u_artistLongTop: [],

      u_trackMediumTop: [],
      u_trackShortTop: [],
      u_trackLongTop: [],
    };

    const search = this.props.location.search;
    const code = new URLSearchParams(search).get("code");

    this.code = code;
  }

  async componentDidMount() {
    const token = await getToken(this.code);
    const user = await getUser(token);
    const artistMediumTop = await getTop(token, "artists", "medium_term");
    const artistShortTop = await getTop(token, "artists", "short_term");
    const artistLongTop = await getTop(token, "artists", "long_term");

    const trackMediumTop = await getTop(token, "tracks", "medium_term");
    const trackShortTop = await getTop(token, "tracks", "short_term");
    const trackLongTop = await getTop(token, "tracks", "long_term");


    this.setState({
      u_name: user.display_name,
      u_artistMediumTop: artistMediumTop,
      u_artistShortTop: artistShortTop,
      u_artistLongTop: artistLongTop,

      u_trackMediumTop: trackMediumTop,
      u_trackShortTop: trackShortTop,
      u_trackLongTop: trackLongTop,
    });

    console.log(this.state.u_artistMediumTop);
  }

  getInfo() {
    console.log(this.code);
  }

  mapTop(array) {
    return array.map((artist, index) => (
      <li>
        {index} - {artist.name}
      </li>
    ));
  }

  render() {
    const artistMediumTop = this.mapTop(this.state.u_artistMediumTop)
    const artistShortTop = this.mapTop(this.state.u_artistShortTop)
    const artistLongTop = this.mapTop(this.state.u_artistLongTop)

    const trackMediumTop = this.mapTop(this.state.u_trackMediumTop)
    const trackShortTop = this.mapTop(this.state.u_trackShortTop)
    const trackLongTop = this.mapTop(this.state.u_trackLongTop)

    return (
      <div>
        <p>Username: {this.state.u_name}</p>

        <Tabs>
          <div label="Artists Short Top">
            <ul>{artistShortTop}</ul>
          </div>
          <div label="Artists Medium Top">
            <ul>{artistMediumTop}</ul>
          </div>
          <div label="Artists Long Top">
            <ul>{artistLongTop}</ul>
          </div>

          <div label="Tracks Short Top">
            <ul>{trackShortTop}</ul>
          </div>
          <div label="Tracks Medium Top">
            <ul>{trackMediumTop}</ul>
          </div>
          <div label="Tracks Long Top">
            <ul>{trackLongTop}</ul>
          </div>
        </Tabs>
      </div>
    );
  }
}
async function getTop(token, type, timeRange) {
  const topRequest = await fetch(
    `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=50`,
    {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

  if (topRequest.status != 200)
    throw new Error("unexcepted error happened: ", topRequest);

  const bodyJson = await topRequest.json();

  return bodyJson.items;
}

async function getUser(token) {
  const userRequest = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (userRequest.status != 200)
    throw new Error("unexcepted error happened: ", userRequest);

  const bodyJson = await userRequest.json();

  return bodyJson;
}

async function getToken(code) {
  const base64encoded = Buffer.from(
    `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const tokenRequest = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64encoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/callback`,
  });

  if (tokenRequest.status != 200)
    throw new Error("unexcepted error happened: ", tokenRequest);

  const bodyJson = await tokenRequest.json();

  return bodyJson.access_token;
}

export default Callback;
