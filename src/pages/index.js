import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import Hero from "../components/Hero/Hero"

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

  const getWeather = async (location) => {
    try {
      const url = `https://wttr.in/${location.latitude},${location.longitude}?format=j1`;
      const response = await fetch(url);
      const data = await response.json();
      setFetchedForecast(data);
      return data.current_condition[0].weatherDesc[0].value;
    } catch (error) {
      setError('getWeather: ' + error.message)
    }
  }

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
    } else {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(function (position) {
          resolve({'latitude' : position.coords.latitude, 'longitude' : position.coords.longitude});
        });
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

    if (!state.enabled) {
      setIsLoading(true);
    }

    let location = JSON.parse(localStorage.getItem('coords'));
    if (!location) {
      console.log('Fetching location...');
      location = await getLocation()
      .then((position) => {
        localStorage.setItem('coords', JSON.stringify(position));
        return position;
      });
    }

    const weather = await getWeather(location);
    const playlists = await getPlaylists(weather);

    console.log('location', location);
    console.log('forecast', weather);
    console.log('playlists', playlists);

    setState({enabled: false});
    setIsLoading(false);
  };

  return (
    <Layout>
      <Hero method={callApi}/>
      <div className="container">
        { isLoading ? <span className="loading">Loading...</span> : '' }
        { error && <p css={{color:"red"}}>{error}</p> }
        { Object.keys(fetchedForecast).length > 0 ?
        <div className="weather-description">
        <span>Current forecast is <em>{fetchedForecast.current_condition[0].weatherDesc[0].value}</em>, with a temperature of <em>{Math.floor(fetchedForecast.current_condition[0].temp_F)}</em> degrees.</span></div> : '' }
        <div className="content-grid">
        { fetchedData && fetchedData.map(node => {
          return node && (
            <div className="card" key={node.id}>
              <a className="card__link" href={node.external_urls.spotify} target="_blank" title="Open playlist in Spotify web app." rel="noopener noreferrer">
                <picture className="card__media">
                  <img
                    src={node.images[0].url} 
                    alt={node.name}
                  />
                </picture>
                <div className="card__meta">
                  {node.name}
                </div>
              </a>
            </div>
          )
        })}
        </div>
      </div>
    </Layout>
  )
};

export default WeatherTracksIndex
