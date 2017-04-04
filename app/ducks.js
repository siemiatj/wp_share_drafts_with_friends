import request from 'axios';

/* ENTRY ACTIONS
================================================================================================ */
const FETCH_DRAFTS_REQUEST = 'draftsforfriends/FETCH_DRAFTS_REQUEST';
const FETCH_DRAFTS_SUCCESS = 'draftsforfriends/FETCH_DRAFTS_SUCCESS';
const FETCH_DRAFTS_FAILURE = 'draftsforfriends/FETCH_DRAFTS_FAILURE';

const FETCH_SHARED_DRAFTS_REQUEST = 'draftsforfriends/FETCH_SHARED_DRAFTS_REQUEST';
const FETCH_SHARED_DRAFTS_SUCCESS = 'draftsforfriends/FETCH_SHARED_DRAFTS_SUCCESS';
const FETCH_SHARED_DRAFTS_FAILURE = 'draftsforfriends/FETCH_SHARED_DRAFTS_FAILURE';

/* INITIAL STATES
================================================================================================ */
export const initialState = {
	drafts: [],
	sharedDrafts: [],
	isFetching: false,
	isError: false,
};

/* HELPERS
================================================================================================ */

/* REDUCERS
================================================================================================ */
export default function reducer( state = initialState, action ) {
	switch ( action.type ) {
		case FETCH_DRAFTS_REQUEST:
		case FETCH_SHARED_DRAFTS_REQUEST:
			return {
				...state,
				isFetching: true,
			};
		case FETCH_DRAFTS_SUCCESS:
			return {
				...state,
				drafts: [ ...action.payload ],
				isFetching: false,
				isError: false,
			};
		case FETCH_SHARED_DRAFTS_SUCCESS:
			return {
				...state,
				isFetching: false,
				isError: false,
			};
		case FETCH_DRAFTS_FAILURE:
		case FETCH_SHARED_DRAFTS_FAILURE:
			return {
				...state,
				isFetching: false,
				isError: true
			};
		default:
			return state;
	}
}

/* ACTION CREATORS
================================================================================================ */
const getDraftsSuccess = ( responseData ) => (
	{
		type: FETCH_DRAFTS_SUCCESS,
		payload: responseData,
	}
);

const getDraftsFailure = ( error ) => (
	{
		type: FETCH_DRAFTS_FAILURE,
		payload: null,
		error,
	}
);

export const getDrafts = () => ( dispatch ) => {
	dispatch( { type: FETCH_DRAFTS_REQUEST } );

	return request.get( `${ APP_DATA.ajax_url }?action=get_drafts&nonce=my-nonce` )
	.then( resp => {
		dispatch( getDraftsSuccess( resp.data ) );
	} )
	.catch( error => {
		dispatch( getDraftsFailure( error ) );
	} );
};

const getSharedDraftsSuccess = ( responseData ) => (
	{
		type: FETCH_SHARED_DRAFTS_SUCCESS,
		payload: responseData,
	}
);

const getSharedDraftsFailure = ( error ) => (
	{
		type: FETCH_SHARED_DRAFTS_FAILURE,
		payload: null,
		error,
	}
);

export const getSharedDrafts = () => ( dispatch ) => {
	dispatch( { type: FETCH_SHARED_DRAFTS_REQUEST } );

	return request.get( `${ APP_DATA.ajax_url }?action=get_shared_drafts&nonce=my-nonce` )
	.then( resp => {
		dispatch( getSharedDraftsSuccess( resp.data ) );
	} )
	.catch( error => {
		dispatch( getSharedDraftsFailure( error ) );
	} );
};
