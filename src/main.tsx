import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

try {
  localStorage.removeItem('nestbasket_google_accounts');
} catch (e) {}

// Force update Service Worker to ensure fresh build is loaded
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      registration.update();
      console.log('NestBasket Service Worker updated:', registration.scope);
    }).catch((err) => {
      console.warn('SW registration warning:', err);
    });
  });
}
