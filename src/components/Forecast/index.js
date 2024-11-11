import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Icon from "../components/Icon";

export default ({ children }) => {
  const data = useStaticQuery(
    graphql`
      query {
        allNounProjectIcon {
          nodes {
            id
            term
            thumbnail_url
          }
        }
      }
    `
  )
  const sunnyIcon = data.allNounProjectIcon.nodes.find(icon => icon.term === "sunny");

  return (
    <div className="icon">
      {/* <img src={data.icon_url} alt={data.term} /> */}
    </div>
  )
}
