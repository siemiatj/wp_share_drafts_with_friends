import expect from 'expect';
import reducer, { initialState } from 'ducks';
import { draftsResponse, sharedDraftsResponse, expirationResponse } from 'tests/helpers';
import * as ACTIONS from 'redux_actions';

describe( 'Drafts reducer', () => {
	const newDrafts = [ ...draftsResponse ];
	const newSharedDrafts = [ ...sharedDraftsResponse ];
	const newExpiration = { ...expirationResponse };

	it( 'should return the initial state', () => {
		expect(
			reducer( undefined, {})
		).toEqual( initialState );
	} );

	
	// one request test, just for the sake
	it( 'Should handle FETCH_DRAFTS_REQUEST', () => {
		expect(
			reducer(undefined, {
				type: ACTIONS.FETCH_DRAFTS_REQUEST,
			})
		).toEqual( {
			...initialState,
			isFetching: true,
		} );
	} );

	it( 'Should handle FETCH_DRAFTS_SUCCESS', () => {
		expect(
			reducer(undefined, {
				type: ACTIONS.FETCH_DRAFTS_SUCCESS,
				payload: newDrafts,
			} )
		).toEqual( {
			...initialState,
			drafts: [ ...newDrafts ],
			isError: false,
			isFetching: false,
		} );
	} );

	// also just one test to limit the amount of repetitive tests here
	it( 'Should handle FETCH_DRAFTS_FAILURE', () => {
		expect(
			reducer( undefined, {
				type: ACTIONS.FETCH_DRAFTS_FAILURE,
				payload: null,
				error: { msg: 'Not found' },
			} )
		).toEqual( {
			...initialState,
			isError: true,
			isFetching: false,
		} );
	} );

	it( 'Should handle FETCH_SHARED_DRAFTS_SUCCESS', () => {
		expect(
			reducer( undefined, {
				type: ACTIONS.FETCH_SHARED_DRAFTS_SUCCESS,
				payload: newSharedDrafts,
			})
		).toEqual( {
			...initialState,
			sharedDrafts: [ ...newSharedDrafts ],
			isError: false,
			isFetching: false,
		} );
	} );

	it( 'Should handle SHARE_DRAFT_SUCCESS', () => {
	  expect( 
	    reducer(undefined, {
	      type: ACTIONS.SHARE_DRAFT_SUCCESS,
	      payload: [ ...newSharedDrafts ],
	    } )
	  ).toEqual( {
	    ...initialState,
	    sharedDrafts: [ ...newSharedDrafts ],
	    isError: false,
	    isFetching: false,
	  } );
	} );

	it( 'Should handle UNSHARE_DRAFT_SUCCESS', () => {
		const localInitialState = {
			...initialState,
			sharedDrafts: [ ...newSharedDrafts ],
		};

		expect(
			reducer( localInitialState, {
				type: ACTIONS.UNSHARE_DRAFT_SUCCESS,
				payload: { post_id: 14, result: true },
			} )
		).toEqual( {
			...initialState,
			sharedDrafts: [ ],
			isError: false,
			isFetching: false,
		} );
	} );


	it('Should handle EXTEND_SHARE_SUCCESS', () => {
		const localInitialState = {
			...initialState,
			sharedDrafts: [ ...newSharedDrafts ],
		};
		const updatedSharedDrafts = [ ...newSharedDrafts ];
		updatedSharedDrafts[ 0 ].shared.expires = newExpiration.share_expiration;

		expect(
			reducer( localInitialState, {
				type: ACTIONS.EXTEND_SHARE_SUCCESS,
				payload: { ...newExpiration },
			} )
		).toEqual( {
			...initialState,
			sharedDrafts: [ ...updatedSharedDrafts ],
			isError: false,
			isFetching: false,
		} );
	} );

} );
