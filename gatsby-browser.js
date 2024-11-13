// gatsby-browser.js
import React from 'react';
import { DataProvider } from './src/context/DataContext';
import './src/assets/scss/global.scss'

export const wrapRootElement = ({ element }) => (
  <DataProvider>{element}</DataProvider>
);
