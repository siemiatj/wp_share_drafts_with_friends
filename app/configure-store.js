import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import reducer from 'ducks';
import createLogger from 'redux-logger';

export default function configureStore() {
	const middleware = [ thunk, promise ];
	let store;

	if ( __DEV__ ) {
		middleware.push( createLogger() );
		store = createStore( reducer, null, compose(
			applyMiddleware( ...middleware ),
			typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
			? window.devToolsExtension() : f => f
		) );
	} else {
		store = createStore( reducer, null, compose( applyMiddleware( ...middleware ), f => f ) );
	}

	return store;
}
