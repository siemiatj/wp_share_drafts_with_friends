/**
 * @module index
 *
 * Application entry point
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'configure-store';
import App from 'components/app';

const store = configureStore();

render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById( 'react-mount' )
);
