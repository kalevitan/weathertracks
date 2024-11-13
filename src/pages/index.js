import React, { useContext, useEffect, useState } from "react"
import { DataContext } from "../context/DataContext"
import Layout from "../components/layout"
import Hero from "../components/Hero"
import Card from "../components/Card"
import Icon from "../components/Icon";

const WeatherTracksIndex = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState({enabled: true})
  const [accessToken, setAccessToken] = useState('')

  // Store client env variables.
  const clientId = process.env.GATSBY_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.GATSBY_SPOTIFY_CLIENT_SECRET;

  // Store data context.
  const { fetchedForecast, setFetchedForecast, fetchedData, setFetchedData } = useContext(DataContext) || {};

  useEffect(() => {
    const spotifyTokenUri = "https://accounts.spotify.com/api/token";

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
  }, [clientId, clientSecret])

  const getWeather = async (location) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude.toFixed(6)}&lon=${location.longitude.toFixed(6)}&units=imperial&appid=${process.env.GATSBY_OPENWEATHER_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      setFetchedForecast(data);
      console.log('getWeather', data);
      return data?.weather[0]?.main;
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
    if (!fetchedData) {
      try {
        const spotifyApi = `https://api.spotify.com/v1/search?q=%22${currentSummary}%22&type=playlist`;
        const response = await fetch(spotifyApi, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        setFetchedData(data.playlists?.items);
        return(data);
      } catch (error) {
        setError('getPlaylists: ' + error.message)
      }
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
      <Hero method={callApi} />
      <div className="container">
        { isLoading ? <span className="loading">Loading...</span> : '' }
        { error && <p css={{color:"red"}}>{error}</p> }
        { fetchedForecast && Object.keys(fetchedForecast).length > 0 ? (
          <div className="weather-description">
            <div className="weather-forecast">
              <h2>{fetchedForecast.weather[0]?.main}</h2>
              <span>with a temperature of {Math.floor(fetchedForecast.main?.temp)}°F<br/>in {fetchedForecast.name}</span>
            </div>
            <Icon term={fetchedForecast.weather[0]?.main}/>
          </div>
        ) : '' }
        <div className="content-grid">
          { fetchedData && fetchedData.map((node, index) => {
            return node && (
              <Card key={index} node={node} />
            )
          })}
        </div>
      </div>
    </Layout>
  )
};

export default WeatherTracksIndex
