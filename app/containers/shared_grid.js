/**
 * @module containers/shared_grid
 */
import { connect } from 'react-redux';
import SharedGrid from 'components/shared_grid';
import { getSharedDrafts } from 'ducks';

function mapStateToProps( state ) {
	return {
		drafts: state.drafts.sharedDrafts,
	};
}

export default connect( mapStateToProps, {
	getSharedDrafts,
} )( SharedGrid );