import React, { useState, useEffect } from "react"
import { css } from "@emotion/core"
import Layout from "../components/layout"

const WeatherTracksIndex = () => {
  const [fetchedData, setFetchedData] = useState([]);
  const [fetchedForecast, setFetchedForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState({enabled: true})

  const [accessToken, setAccessToken] = useState('')
  useEffect(() => {
    const spotifyTokenUri = "https://accounts.spotify.com/api/token";
    const clientId = process.env.GATSBY_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.GATSBY_SPOTIFY_CLIENT_SECRET;

    let url = new URL(spotifyTokenUri);
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')));
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    // Runtime access token fetching.
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        setAccessToken(data.access_token)
      })
  }, [])

  const getWeather = async (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    const url = `https://wttr.in/${latitude},${longitude}?format=j1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setFetchedForecast(data);
      return data.current_condition[0].weatherDesc[0].value;
    } catch (error) {
      setError('getWeather: ' + error.message)
    }
  }

  const getLocation = async () => {
    if(!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
    } else {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }
  };

  const getPlaylists = async currentSummary => {
    try {
      const spotifyApi = `https://api.spotify.com/v1/search?q=%22${currentSummary}%22&type=playlist`;
      const response = await fetch(spotifyApi, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      setFetchedData(data.playlists.items);
      return(data);
    } catch (error) {
      setError('getPlaylists: ' + error.message)
    }
  };

  const callApi = async () => {
    setIsLoading(true);
    
    const location = await getLocation();
    const weather = await getWeather(location);
    const playlists = await getPlaylists(weather);

    console.log(location);
    console.log(weather);
    console.log(playlists);

    setState({enabled: false});
    setIsLoading(false);
  };

  return (
    <Layout>
      <h2>Find song recommendations based on your location weather.</h2>
      { error && <p css={{color:"red"}}>{error}</p> }
      { Object.keys(fetchedForecast).length > 0 ? 
      <div class="weather-description" css={css`
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;`}>
          <span>Current forecast is <em>{fetchedForecast.current_condition[0].weatherDesc[0].value}</em>, with a temperature of <em>{Math.floor(fetchedForecast.current_condition[0].temp_F)}</em> degrees.</span></div> : '' }
      <p style= {{display: state.enabled ? "block" : "none"}}>To begin, click the button below.</p>
      <button css={css`
        background-color: #1ed760;
        border: none;
        cursor: pointer;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 10px 0;`} onClick={callApi}>Click me</button>
      { isLoading ? <div><p>Loading...</p></div> : '' }
      <div css={css`
        display: grid;
        grid-template-columns: auto auto auto;
        margin-left: -20px;
        margin-right: -20px;`}>
      { fetchedData && fetchedData.map(node => {
        return node && (
          <div
            css={css`
              padding: 20px;
              text-align: center;`}
            key={node.id}>
              <a href={node.external_urls.spotify} target="_blank" title="Open playlist in Spotify web app." rel="noopener noreferrer">
                <figure>
                  <img css={css `object-fit: cover; width:257px; height:257px;`} src={node.images[0].url} alt={node.name}/>
                  <figcaption>{node.name}</figcaption>
                </figure>
              </a>
          </div>
        )
      })}
      </div>
    </Layout>
  )
};

export default WeatherTracksIndex
