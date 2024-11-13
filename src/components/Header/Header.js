import React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"

export default ({ children }) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <Link
              to={`/`}>
                {data.site.siteMetadata.title}
            </Link>
          </div>
        </div>
        <div className="navbar-menu">
          <Link
            to={`/about`}>
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}