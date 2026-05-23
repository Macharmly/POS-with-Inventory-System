import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

import { useThemeStore } from './store/themeStore';

function RootApp() {

  const theme = useThemeStore(
    (state) => state.theme
  );

  return (
    <div className={theme}>
      <App />
    </div>
  );
}

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);