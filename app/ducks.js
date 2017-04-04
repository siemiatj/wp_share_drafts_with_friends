import request from 'axios';
import reject from 'lodash.reject';

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

const UNSHARE_DRAFT_REQUEST = 'draftsforfriends/UNSHARE_DRAFT_REQUEST';
const UNSHARE_DRAFT_SUCCESS = 'draftsforfriends/UNSHARE_DRAFT_SUCCESS';
const UNSHARE_DRAFT_FAILURE = 'draftsforfriends/UNSHARE_DRAFT_FAILURE';

const EXTEND_SHARE_REQUEST = 'draftsforfriends/EXTEND_SHARE_REQUEST';
const EXTEND_SHARE_SUCCESS = 'draftsforfriends/EXTEND_SHARE_SUCCESS';
const EXTEND_SHARE_FAILURE = 'draftsforfriends/EXTEND_SHARE_FAILURE';

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
		case SHARE_DRAFT_REQUEST:
		case UNSHARE_DRAFT_REQUEST:
		case EXTEND_SHARE_REQUEST:
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
		case SHARE_DRAFT_SUCCESS:
			const newDraft = { ...action.payload[ 0 ] };

			return {
				...state,
				sharedDrafts: [
					...state.sharedDrafts,
					newDraft
				],
				isFetching: false,
				isError: false,
			};
		case UNSHARE_DRAFT_SUCCESS:
			const result = action.payload.result;
			const draftId = parseInt( action.payload.post_id, 10 );
			let newDraftsArray = [ ...state.sharedDrafts ];

			if ( result ) {
				newDraftsArray = reject( newDraftsArray, draft => draft.post.ID === draftId );
			}

			return {
				...state,
				sharedDrafts: newDraftsArray,
				isFetching: false,
				isError: false,
			};
		case EXTEND_SHARE_SUCCESS:
			const payload = action.payload;
			const newDrafts = [];

			state.sharedDrafts.forEach( draft => {
				if ( draft.post.ID === payload.post_id ) {
					const updatedDraft = { ...draft };

					updatedDraft.shared.expires = parseInt( payload.share_expiration, 10 );
					newDrafts.push( updatedDraft );
				} else {
					newDrafts.push( draft );
				}
			} );

			return {
				...state,
				sharedDrafts: newDrafts,
				isFetching: false,
				isError: false,
			};
		case FETCH_DRAFTS_FAILURE:
		case FETCH_SHARED_DRAFTS_FAILURE:
		case SHARE_DRAFT_FAILURE:
		case UNSHARE_DRAFT_FAILURE:
		case EXTEND_SHARE_FAILURE:
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

const unShareDraftSuccess = ( responseData ) => (
	{
		type: UNSHARE_DRAFT_SUCCESS,
		payload: responseData,
	}
);

const unShareDraftFailure = ( error ) => (
	{
		type: UNSHARE_DRAFT_FAILURE,
		payload: null,
		error,
	}
);

export const unShareDraft = ( postId ) => ( dispatch ) => {
	dispatch( { type: UNSHARE_DRAFT_REQUEST } );

	const opts = {
		method: 'delete',
		url: `${ APP_DATA.ajax_url }?action=stop_sharing_draft&post_id=${ postId }`,
		headers: { 'X-WP-Nonce': APP_DATA.nonce },
	};

	return request( opts )

	.then( resp => {
		dispatch( unShareDraftSuccess( resp.data ) );
	} )
	.catch( error => {
		dispatch( unShareDraftFailure( error ) );
	} );
};

const extendShareSuccess = ( responseData ) => (
	{
		type: EXTEND_SHARE_SUCCESS,
		payload: responseData,
	}
);

const extendShareFailure = ( error ) => (
	{
		type: EXTEND_SHARE_FAILURE,
		payload: null,
		error,
	}
);

export const extendShare = ( formData ) => ( dispatch ) => {
	dispatch( { type: EXTEND_SHARE_REQUEST } );

	const data = new FormData();
	data.append( 'action', 'extend_sharing_draft' );
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
		dispatch( extendShareSuccess( resp.data ) );
	} )
	.catch( error => {
		dispatch( extendShareFailure( error ) );
	} );
};
