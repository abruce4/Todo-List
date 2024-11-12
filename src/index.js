// First, we need to bring in some special tools to help us build our website
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // This is like getting our main toy box (App) ready to play with

// Now, we're going to put our website on the screen!
ReactDOM.render(
  // StrictMode is like a safety helmet - it helps us catch mistakes
  <React.StrictMode>
    {/* App is our whole website - everything we want to show */}
    <App />
  </React.StrictMode>,
  // This finds the special spot on our webpage (like a toy shelf) where we want to put our App
  document.getElementById('root')
);