import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import SharedGrid from 'components/shared_grid';
import ActionIndicator from 'components/action_indicator';

const props = {
	drafts: [],
	xhrRequest: false,
	getSharedDrafts: () => Promise.resolve( true ),
	unShareDraft: () => Promise.resolve( true ),
	extendShare: () => Promise.resolve( true ),
};

const render = ( overrideProps = {} ) => {
	const component = shallow(
		<SharedGrid
			{ ...props }
			{ ...overrideProps }
		/>
	);

	return {
		wrapper: component,
		body: component.find( 'tbody' ),
	};
};

describe( 'Header - Help Drawer Button', () => {
	it( 'can render component', () => {
		const { wrapper, body } = render();
		expect( wrapper.length ).toBeTruthy();
		expect( body.length ).toBeTruthy();
	} );

	it( 'shows spinner', () => {
		const { wrapper } = render( {
			...props,
			xhrRequest: true,
		} );
		const actionIndicator = wrapper.find( ActionIndicator );

		expect( actionIndicator.length ).toBeTruthy();
	} );
} );
