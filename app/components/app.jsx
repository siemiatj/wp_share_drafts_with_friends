import React from 'react';
import SharedGrid from 'containers/shared_grid';
import ShareDraftsForm from 'containers/share_drafts';
import 'style.css';

const App = () => (
  <div className="wrap">
    <h2>Drafts for Friends</h2>
    <h3>Currently shared drafts</h3>
      <SharedGrid />
    <h3>Share Drafts</h3>
      <ShareDraftsForm />
  </div>
);

export default App;

