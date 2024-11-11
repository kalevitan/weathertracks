import React from "react"
import Layout from "../components/layout"

export default () => (
    <Layout>
      <div className='about'>
        <div className="container">
          <h2>What This App Does</h2>
          <p>Once you share your location with WeatherTracks, it retrieves the latest forecast from the <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeather</a> service. This weather summary is then used to search <a href="https://developer.spotify.com/documentation" target="_blank" rel="noopener noreferrer">Spotify's API</a> for playlist names that align with the forecast description.</p>
        </div>
      </div>
    </Layout>
)