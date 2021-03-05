import React from "react"
import Layout from "../components/layout"

export default () => (
    <Layout>
      <div className='about'>
        <div className="container">
          <h1>What This App Does</h1>
          <p>
            Once you share your location with WeatherTracks, it fetches the current forecast from the <a href="https://github.com/chubin/wttr.in" target="_blank" rel="noopener noreferrer">wttr.in</a> service. The forecast summary is then used to query <a href="https://developer.spotify.com/documentation" target="_blank" rel="noopener noreferrer">Spotify's API</a> for playlist names that match the weather description.
          </p>
        </div>
      </div>
    </Layout>
)