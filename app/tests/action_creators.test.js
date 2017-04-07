import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { polyfill } from 'es6-promise';
import promise from 'redux-promise';
import axios from 'axios';
import expect from 'expect';
import sinon from 'sinon';
import { initialState, getDrafts, getSharedDrafts,
	shareDraft, unShareDraft, extendShare } from 'ducks';
import { draftsResponse, sharedDraftsResponse, expirationResponse } from 'tests/helpers';
import * as ACTIONS from 'redux_actions';

polyfill();

describe( 'Drafts Action Creators: ', () => {
	const newDrafts = [ ...draftsResponse ];
	const newSharedDrafts = [ ...sharedDraftsResponse ];
	const newExpiration = { ...expirationResponse };
	const middlewares = [ thunk, promise ];
	const mockStore = configureStore( middlewares );

	describe( 'Test action creators', () => {
		let sandbox;

		beforeEach( () => {
			sandbox = sinon.sandbox.create(); // eslint-disable-line
		} );

		afterEach( () => {
			sandbox.restore();
		} );

		it( 'Fetches drafts', done => {
			const expectedActions = [
				{
					type: ACTIONS.FETCH_DRAFTS_REQUEST,
				}, {
					type: ACTIONS.FETCH_DRAFTS_SUCCESS,
					payload: [ ...newDrafts ],
				}
			];

			sandbox.stub( axios, 'get' ).returns(
				new Promise( resolve => {
					resolve( { data: [ ...newDrafts ] } );
				} )
			);

			const store = mockStore( {
				drafts: { ...initialState },
			} );

			store.dispatch( getDrafts() )
				.then( () => {
					expect( store.getActions() ).toEqual( expectedActions );
				} ).then( done )
				.catch( done );
		} );

		it( 'Fetches shared drafts', done => {
			const expectedActions = [
				{
					type: ACTIONS.FETCH_SHARED_DRAFTS_REQUEST,
				}, {
					type: ACTIONS.FETCH_SHARED_DRAFTS_SUCCESS,
					payload: [ ...newSharedDrafts ],
				}
			];

			sandbox.stub( axios, 'get' ).returns(
				new Promise( resolve => {
					resolve( { data: [ ...newSharedDrafts ] } );
				} )
			);

			const store = mockStore( {
				drafts: { ...initialState },
			} );

			store.dispatch( getSharedDrafts() )
				.then( () => {
					expect( store.getActions() ).toEqual( expectedActions );
				} ).then( done )
				.catch( done );
		} );
	} );
} );
