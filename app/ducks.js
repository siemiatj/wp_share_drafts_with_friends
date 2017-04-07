/**
 * @module ducks
 */
import request from 'axios';
import reject from 'lodash.reject';

/* ENTRY ACTIONS
================================================================================================ */
import * as ACTIONS from 'redux_actions';

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
		case ACTIONS.FETCH_DRAFTS_REQUEST:
		case ACTIONS.FETCH_SHARED_DRAFTS_REQUEST:
		case ACTIONS.SHARE_DRAFT_REQUEST:
		case ACTIONS.UNSHARE_DRAFT_REQUEST:
		case ACTIONS.EXTEND_SHARE_REQUEST:
			return {
				...state,
				isFetching: true,
			};
		case ACTIONS.FETCH_DRAFTS_SUCCESS:
			return {
				...state,
				drafts: [ ...action.payload ],
				isFetching: false,
				isError: false,
			};
		case ACTIONS.FETCH_SHARED_DRAFTS_SUCCESS:
			return {
				...state,
				sharedDrafts: [ ...action.payload ],
				isFetching: false,
				isError: false,
			};
		case ACTIONS.SHARE_DRAFT_SUCCESS:
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
		case ACTIONS.UNSHARE_DRAFT_SUCCESS:
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
		case ACTIONS.EXTEND_SHARE_SUCCESS:
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
		case ACTIONS.FETCH_DRAFTS_FAILURE:
		case ACTIONS.FETCH_SHARED_DRAFTS_FAILURE:
		case ACTIONS.SHARE_DRAFT_FAILURE:
		case ACTIONS.UNSHARE_DRAFT_FAILURE:
		case ACTIONS.EXTEND_SHARE_FAILURE:
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
		type: ACTIONS.FETCH_DRAFTS_SUCCESS,
		payload: responseData,
	}
);

const getDraftsFailure = ( error ) => (
	{
		type: ACTIONS.FETCH_DRAFTS_FAILURE,
		payload: null,
		error,
	}
);

export const getDrafts = () => ( dispatch ) => {
	dispatch( { type: ACTIONS.FETCH_DRAFTS_REQUEST } );

	return request.get( `${ APP_DATA.ajax_url }?action=get_drafts&nonce=${ APP_DATA.nonce }` )
	.then( resp => {
		dispatch( getDraftsSuccess( resp.data ) );
	} )
	.catch( error => {
		dispatch( getDraftsFailure( error ) );
	} );
};

const getSharedDraftsSuccess = ( responseData ) => (
	{
		type: ACTIONS.FETCH_SHARED_DRAFTS_SUCCESS,
		payload: responseData,
	}
);

const getSharedDraftsFailure = ( error ) => (
	{
		type: ACTIONS.FETCH_SHARED_DRAFTS_FAILURE,
		payload: null,
		error,
	}
);

export const getSharedDrafts = () => ( dispatch ) => {
	dispatch( { type: ACTIONS.FETCH_SHARED_DRAFTS_REQUEST } );

	return request.get( `${ APP_DATA.ajax_url }?action=get_shared_drafts&nonce=${ APP_DATA.nonce }` )
	.then( resp => {
		dispatch( getSharedDraftsSuccess( resp.data ) );
	} )
	.catch( error => {
		dispatch( getSharedDraftsFailure( error ) );
	} );
};

const shareDraftSuccess = ( responseData ) => (
	{
		type: ACTIONS.SHARE_DRAFT_SUCCESS,
		payload: responseData,
	}
);

const shareDraftFailure = ( error ) => (
	{
		type: ACTIONS.SHARE_DRAFT_FAILURE,
		payload: null,
		error,
	}
);

export const shareDraft = ( formData ) => ( dispatch ) => {
	dispatch( { type: ACTIONS.SHARE_DRAFT_REQUEST } );

	const data = new FormData();
	data.append( 'action', 'start_sharing_draft' );
	data.append( 'nonce', APP_DATA.nonce );
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
		type: ACTIONS.UNSHARE_DRAFT_SUCCESS,
		payload: responseData,
	}
);

const unShareDraftFailure = ( error ) => (
	{
		type: ACTIONS.UNSHARE_DRAFT_FAILURE,
		payload: null,
		error,
	}
);

export const unShareDraft = ( postId ) => ( dispatch ) => {
	dispatch( { type: ACTIONS.UNSHARE_DRAFT_REQUEST } );

	const opts = {
		method: 'delete',
		url: `${ APP_DATA.ajax_url }?action=stop_sharing_draft&post_id=${ postId }&nonce=${ APP_DATA.nonce }`,
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
		type: ACTIONS.EXTEND_SHARE_SUCCESS,
		payload: responseData,
	}
);

const extendShareFailure = ( error ) => (
	{
		type: ACTIONS.EXTEND_SHARE_FAILURE,
		payload: null,
		error,
	}
);

export const extendShare = ( formData ) => ( dispatch ) => {
	dispatch( { type: ACTIONS.EXTEND_SHARE_REQUEST } );

	const data = new FormData();
	data.append( 'action', 'extend_sharing_draft' );
	data.append( 'nonce', APP_DATA.nonce );
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
