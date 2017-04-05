/**
 * @module components/app
 */
import React from 'react';
import SharedGrid from 'containers/shared_grid';
import ShareDraftsForm from 'containers/share_drafts';
import 'style.css';

/**
 * Root application component
 *
 * @returns {void}
 */
const App = () => (
  <div className="wrap">
    <h2>Drafts for Friends</h2>
    <h3>{ APP_DATA.translations[ 'app-currentlyshared' ] }</h3>
      <SharedGrid />
    <h3>{ APP_DATA.translations[ 'app-sharedrafts' ] }</h3>
      <ShareDraftsForm />
  </div>
);

export default App;

