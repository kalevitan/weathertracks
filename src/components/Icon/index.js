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

  // Map OpenWeatherMap condition names to Noun Project terms in the collection
  const mappings = {
    'Clouds': 'cloud',
    'Snow': 'snowflake',
    'Thunderstorm': 'stormy',
    'Drizzle': 'drizzle',
    'Rain': 'rain',
    'Mist': 'fog',
    'Haze': 'fog',
    'Fog': 'fog',
  };

  if (mappings[term]) {
    term = mappings[term];
  }

  // We need to override the term "clear" because it's not a valid search term, and update based on time of day.
  const timeOfDay = new Date().getHours();
  if (term.toLowerCase() === "clear" && timeOfDay >= 6 && timeOfDay < 18) {
    term = "sunshine";
  } else if (term.toLowerCase() === "clear") {
    term = "clear-night";
  }

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
