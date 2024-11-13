// src/context/DataContext.js
import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [fetchedForecast, setFetchedForecast] = useState([]);
  const [fetchedData, setFetchedData] = useState(null);

  return (
    <DataContext.Provider value={{ fetchedForecast, setFetchedForecast, fetchedData, setFetchedData }}>
      {children}
    </DataContext.Provider>
  );
};
