/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
 require("dotenv").config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: `WeatherTracks`,
  },
  plugins: [
    `gatsby-plugin-emotion`,
    `gatsby-plugin-sass`,
  ],
}