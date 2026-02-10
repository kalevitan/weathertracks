import React, { useContext, useEffect, useState } from "react"
import { DataContext } from "../context/DataContext"
import Layout from "../components/layout"
import Hero from "../components/Hero"
import Card from "../components/Card"
import Icon from "../components/Icon";

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getMoodFromWeather = (condition, temp) => {
  const moods = {
    Rain: ['chill', 'mellow', 'lo-fi', 'cozy'],
    Drizzle: ['chill', 'soft', 'calm'],
    Thunderstorm: ['intense', 'dramatic', 'energy'],
    Snow: ['cozy', 'peaceful', 'ambient', 'winter'],
    Clear: ['feel good', 'upbeat', 'vibes', 'sunny'],
    Clouds: ['mellow', 'indie', 'chill', 'dreamy'],
    Mist: ['ambient', 'ethereal', 'calm'],
    Fog: ['ambient', 'ethereal', 'dreamy'],
    Haze: ['chill', 'lo-fi', 'mellow'],
  };
  const tempMoods = temp < 40 ? ['winter', 'cozy', 'fireplace']
    : temp < 60 ? ['autumn', 'crisp', 'coffee shop']
    : temp < 80 ? ['spring', 'breezy', 'feel good']
    : ['summer', 'beach', 'tropical'];

  return [...(moods[condition] || ['chill']), ...tempMoods];
};

const buildSearchQueries = (forecast) => {
  const condition = forecast.weather[0]?.main;
  const temp = forecast.main?.temp;
  const city = forecast.name;
  const timeOfDay = getTimeOfDay();
  const moods = getMoodFromWeather(condition, temp);

  // Pick varied moods for different queries
  const weatherMood = moods[0];
  const tempMood = moods[moods.length - 2];

  const sections = [
    {
      label: `${condition} ${timeOfDay}`,
      query: `${condition.toLowerCase()} ${timeOfDay} ${weatherMood}`,
    },
    {
      label: `${city} vibes`,
      query: `${city} music`,
    },
    {
      label: `${tempMood} ${timeOfDay}`,
      query: `${tempMood} ${timeOfDay} playlist`,
    },
  ];

  return sections;
};

const WeatherTracksIndex = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState({enabled: true})
  const [accessToken, setAccessToken] = useState('')

  // Store client env variables.
  const clientId = process.env.GATSBY_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.GATSBY_SPOTIFY_CLIENT_SECRET;

  // Store data context.
  const { fetchedForecast, setFetchedForecast, playlistSections, setPlaylistSections } = useContext(DataContext) || {};

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
      return data;
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

  const searchSpotify = async (query, limit = 8) => {
    try {
      const offset = Math.floor(Math.random() * 50);
      const spotifyApi = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=${limit}&offset=${offset}`;
      const response = await fetch(spotifyApi, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      return data.playlists?.items?.filter(Boolean) || [];
    } catch (error) {
      setError('searchSpotify: ' + error.message);
      return [];
    }
  };

  const fetchPlaylists = async (forecast) => {
    const queries = buildSearchQueries(forecast);

    const results = await Promise.all(
      queries.map(async (section) => {
        const items = await searchSpotify(section.query);
        return { label: section.label, items };
      })
    );

    setPlaylistSections(results.filter(s => s.items.length > 0));
  };

  const callApi = async () => {
    setIsLoading(true);

    let location = JSON.parse(localStorage.getItem('coords'));
    if (!location) {
      location = await getLocation()
      .then((position) => {
        localStorage.setItem('coords', JSON.stringify(position));
        return position;
      });
    }

    // Use existing forecast on reshuffle, otherwise fetch new
    const forecast = fetchedForecast?.weather ? fetchedForecast : await getWeather(location);

    if (forecast?.weather) {
      setPlaylistSections(null);
      await fetchPlaylists(forecast);
    }

    setState({enabled: false});
    setIsLoading(false);
  };

  const hasResults = fetchedForecast?.weather;

  return (
    <Layout>
      <Hero method={callApi} hasResults={hasResults} />
      <div className="container">
        { isLoading ? <span className="loading">Loading...</span> : '' }
        { error && <p css={{color:"red"}}>{error}</p> }
        <div className={hasResults ? "main-layout" : ""}>
          { hasResults && (
            <aside className="weather-sidebar">
              <div className="weather-card">
                <div className="weather-card__temp-row">
                  <span className="weather-card__temp">{Math.floor(fetchedForecast.main?.temp)}°</span>
                  <div className="weather-card__condition">
                    <Icon term={fetchedForecast.weather[0]?.main}/>
                    <span>{fetchedForecast.weather[0]?.main}</span>
                  </div>
                </div>
                <span className="weather-card__location">{fetchedForecast.name}</span>
                <div className="weather-card__stats">
                  <div className="weather-card__stat">
                    <span className="weather-card__stat-value">{fetchedForecast.main?.humidity}%</span>
                    <span className="weather-card__stat-label">Humidity</span>
                  </div>
                  <div className="weather-card__stat">
                    <span className="weather-card__stat-value">{Math.round(fetchedForecast.wind?.speed)} mph</span>
                    <span className="weather-card__stat-label">Wind</span>
                  </div>
                  <div className="weather-card__stat">
                    <span className="weather-card__stat-value">{Math.floor(fetchedForecast.main?.feels_like)}°</span>
                    <span className="weather-card__stat-label">Feels Like</span>
                  </div>
                </div>
              </div>
            </aside>
          )}
          <div className="playlist-content">
            { playlistSections && playlistSections.map((section, i) => (
              <div key={i} className="playlist-section">
                <p className="section-label">{section.label}</p>
                <div className="content-grid">
                  { section.items.map((node, index) => (
                    <Card key={node.id || index} node={node} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
};

export default WeatherTracksIndex
