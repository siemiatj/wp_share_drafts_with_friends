/**
 * @module containers/share_drafts
 */
import { connect } from 'react-redux';
import ShareDrafts from 'components/share_drafts';
import { getDrafts } from 'ducks';

function mapStateToProps( state ) {
	return {
		drafts: state.drafts.drafts,
	};
}

export default connect( mapStateToProps, {
	getDrafts,
} )( ShareDrafts );
