import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
