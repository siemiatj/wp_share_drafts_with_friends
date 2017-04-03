import { combineReducers } from 'redux';

/* ENTRY ACTIONS
================================================================================================ */
const FETCH_DRAFTS_REQUEST = 'draftsforfriends/FETCH_DRAFTS_REQUEST';
const FETCH_DRAFTS_SUCCESS = 'draftsforfriends/FETCH_DRAFTS_SUCCESS';
const FETCH_DRAFTS_FAILURE = 'draftsforfriends/FETCH_DRAFTS_FAILURE';

/* INITIAL STATES
================================================================================================ */
export const initialState = {
	data: [],
	isFetching: false,
	isError: false,
};

/* HELPERS
================================================================================================ */

/* REDUCERS
================================================================================================ */
function draftsReducer( state = initialState, action ) {
	switch ( action.type ) {
		case FETCH_DRAFTS_REQUEST:
			return {
				...state,
				isFetching: true,
			};
		case FETCH_DRAFTS_SUCCESS:
			return {
				...state,
				isFetching: false,
				isError: false,
			};
		case FETCH_DRAFTS_FAILURE:
			return {
				...state,
				isFetching: false,
				isError: true
			};
		default:
			return state;
	}
}

const reducer = combineReducers( { drafts: draftsReducer } );

export default reducer;

/* ACTION CREATORS
================================================================================================ */
export const getDrafts = () => ( dispatch ) => {
	dispatch( { type: FETCH_DRAFTS_REQUEST } );

	return Promise.resolve( true );
};
