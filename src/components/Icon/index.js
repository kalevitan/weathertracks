import React from "react";
import { graphql, useStaticQuery } from "gatsby";

const WeatherIcon = ({ term }) => {
  const data = useStaticQuery(graphql`
    query {
      allNounProjectIcon {
        nodes {
          icons {
            term
            thumbnail_url
            tags
          }
        }
      }
    }
  `);

  // Flatten the icons array from all nodes
  const allIcons = data.allNounProjectIcon.nodes.flatMap(node => node.icons);

  // Filter the icons to find the one with the specified term or a close match
  const icon = allIcons.find(icon =>
    icon.term.toLowerCase() === term.toLowerCase() ||
    (icon.tags && icon.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase())))
  );

  // If the icon is found, return an image element with its thumbnail
  if (icon) {
    return <img src={icon.thumbnail_url} alt={term} />;
  }

  return null;
};

export default WeatherIcon;