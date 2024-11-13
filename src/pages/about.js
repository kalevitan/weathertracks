import React from "react"
import Layout from "../components/layout"

export default () => (
    <Layout>
      <div className='about'>
        <div className="container">
          <h1>What This App Does:</h1>
          <p>Once you share your location with WeatherTracks, it retrieves the latest forecast from the <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeather</a> service. This weather summary is then used to search <a href="https://developer.spotify.com/documentation" target="_blank" rel="noopener noreferrer">Spotify's API</a> for playlist names and <a href="https://thenounproject.com/" target="_blank" rel="noopener noreferrer">The Noun Project</a> for weather icons that align with the forecast description.</p>
          <div className="license-agreement">
            <p>Weather icons by <a href="https://thenounproject.com/creator/komardews/" target="_blank" rel="noreferrer">Komardews</a> licensed under <a href="https://thenounproject.com/legal/terms-of-use/#icon-licenses">CC BY 3.0</a></p>
          </div>
        </div>
      </div>
    </Layout>
)