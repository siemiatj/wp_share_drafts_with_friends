import request from 'axios';

/* ENTRY ACTIONS
================================================================================================ */
const FETCH_DRAFTS_REQUEST = 'draftsforfriends/FETCH_DRAFTS_REQUEST';
const FETCH_DRAFTS_SUCCESS = 'draftsforfriends/FETCH_DRAFTS_SUCCESS';
const FETCH_DRAFTS_FAILURE = 'draftsforfriends/FETCH_DRAFTS_FAILURE';

const FETCH_SHARED_DRAFTS_REQUEST = 'draftsforfriends/FETCH_SHARED_DRAFTS_REQUEST';
const FETCH_SHARED_DRAFTS_SUCCESS = 'draftsforfriends/FETCH_SHARED_DRAFTS_SUCCESS';
const FETCH_SHARED_DRAFTS_FAILURE = 'draftsforfriends/FETCH_SHARED_DRAFTS_FAILURE';

const SHARE_DRAFT_REQUEST = 'draftsforfriends/SHARE_DRAFT_REQUEST';
const SHARE_DRAFT_SUCCESS = 'draftsforfriends/SHARE_DRAFT_SUCCESS';
const SHARE_DRAFT_FAILURE = 'draftsforfriends/SHARE_DRAFT_FAILURE';

// const UNSHARE_DRAFT_REQUEST = 'draftsforfriends/UNSHARE_DRAFT_REQUEST';
// const UNSHARE_DRAFT_SUCCESS = 'draftsforfriends/UNSHARE_DRAFT_SUCCESS';
// const UNSHARE_DRAFT_FAILURE = 'draftsforfriends/UNSHARE_DRAFT_FAILURE';

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
				sharedDrafts: [ ...action.payload ],
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

const shareDraftSuccess = ( responseData ) => (
	{
		type: SHARE_DRAFT_SUCCESS,
		payload: responseData,
	}
);

const shareDraftFailure = ( error ) => (
	{
		type: SHARE_DRAFT_FAILURE,
		payload: null,
		error,
	}
);

export const shareDraft = ( formData ) => ( dispatch ) => {
	dispatch( { type: SHARE_DRAFT_REQUEST } );

	const data = new FormData();
	data.append( 'action', 'start_sharing_draft' );
	data.append( 'nonce', 'my-nonce' );
	data.append( 'post_id', formData.post_id );
	data.append( 'expire_time', formData.expire_time );
	data.append( 'expire_unit', formData.expire_unit );

	const opts = {
		method: 'post',
		url: `${ APP_DATA.ajax_url }`,
		data: data,
		headers: { 'Content-Type': 'multipart/form-data' },
	};

	return request( opts )
	.then( resp => {
		dispatch( shareDraftSuccess( resp.data ) );
	} )
	.catch( error => {
		dispatch( shareDraftFailure( error ) );
	} );
};
