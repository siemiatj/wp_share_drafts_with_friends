/**
 * @module containers/shared_grid
 */
import { connect } from 'react-redux';
import SharedGrid from 'components/shared_grid';
import { getDrafts } from 'ducks';

function mapStateToProps( state ) {
	return {
		drafts: state.drafts.data,
	};
}

export default connect( mapStateToProps, {
	getDrafts,
} )( SharedGrid );
