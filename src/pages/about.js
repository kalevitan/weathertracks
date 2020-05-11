import React from "react"
import Layout from "../components/layout"

export default () => (
    <Layout>
      <h2>What This App Does:</h2>
      <p>
        Once you share your location with WeatherTracks, we fetch your location's current weather from <a href="https://github.com/chubin/wttr.in" target="_blank" rel="noopener noreferrer">wttr.in</a>. The forecast summary is then used to query <a href="https://developer.spotify.com/documentation" target="_blank" rel="noopener noreferrer">Spotify's API</a> for playlist names that matches your weather description.
      </p>
    </Layout>
)