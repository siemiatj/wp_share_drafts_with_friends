import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import drafts from 'ducks';

const rootReducer = combineReducers( {
	drafts,
	form,
} );

export default rootReducer;
