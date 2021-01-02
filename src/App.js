import React, { useEffect, useState } from "react"
import './App.css';
import Login from "./Login"
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import Player from "./Player"
import { useDataLayerValue } from "./DataLayer";

const spotify = new SpotifyWebApi();  //allow spotify to talk to react

function App() {
  const [{ user, token }, dispatch] = useDataLayerValue(); //dataLayer.user  // pulling user from dataLayer

  //run code based on some given condition 
  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;

    if (_token) {
      dispatch({
        type: "SET_TOKEN",
        token: _token
      })
      spotify.setAccessToken(_token); //giving access token to spotify api
      spotify.getMe().then(user => {  //getUsers account

        dispatch({
          type: "SET_USER",
          user: user
        });
      });
    }
    //get data from spotify to show playlists
    spotify.getUserPlaylists().then((playlists) => {
      dispatch({
        type: "SET_PLAYLISTS",
        playlists: playlists
      });
    });
    // console.log("I have a token >>>", token);

    spotify.getPlaylist("4bu2M0DVRWmRoCwKZ47DWG").then(response =>
      dispatch({
        type: "SET_DISCOVER_WEEKLY",
        discover_weekly: response
      }));

  }, []);

  return (
    <div className="app">
      {
        token ? <Player spotify={spotify} /> : <Login />
      }
    </div>
  );
}

export default App;
