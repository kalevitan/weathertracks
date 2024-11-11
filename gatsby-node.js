// gatsby-node.js

const OAuth = require('oauth');
const util = require('util');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type NounProjectIcon implements Node {
      icons: [Icon]
      tags: [String]
      term: String
      thumbnail_url: String
    }

    type Icon {
      tags: [String]
      term: String
      thumbnail_url: String
    }
  `);
};

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

  // Initialize OAuth with your API keys
  const oauth = new OAuth.OAuth(
    'https://api.thenounproject.com',
    'https://api.thenounproject.com',
    process.env.GATSBY_NOUN_PROJECT_API_KEY,       // Use environment variables for keys
    process.env.GATSBY_NOUN_PROJECT_API_SECRET,
    '1.0',
    null,
    'HMAC-SHA1'
  );

  // Promisify the OAuth get method to use async/await
  const oauthGet = util.promisify(oauth.get.bind(oauth));

  try {
    // Make the API call and parse the response
    const data = await oauthGet('https://api.thenounproject.com/v2/collection/156159', null, null);
    const iconData = JSON.parse(data);

    // Extract the icons array from the collection object
    const icons = iconData.collection.icons.map(icon => ({
      term: icon.term,
      thumbnail_url: icon.thumbnail_url,
      tags: icon.tags,
    }));

    // Create a node in Gatsby's data layer
    createNode({
      ...iconData.collection,
      id: createNodeId(`weather-icon-set-156159`),
      icons: icons,
      internal: {
        type: 'NounProjectIcon', // Define a custom GraphQL type
        contentDigest: createContentDigest(iconData.collection),
      },
    });
  } catch (error) {
    console.error('Error fetching icon:', error);
  }
};