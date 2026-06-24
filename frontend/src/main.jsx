import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import App from './App';
import './global.css';

const cachedTheme =
  localStorage.getItem("theme");

if (cachedTheme) {

  document.documentElement.setAttribute(
    "data-theme",
    cachedTheme
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);