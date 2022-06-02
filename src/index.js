import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../service-worker.js')
      .then(() => { console.log('Registered service worker') })
      .catch(() => { console.log('Could not register service worker') });
  }
}

registerServiceWorker();