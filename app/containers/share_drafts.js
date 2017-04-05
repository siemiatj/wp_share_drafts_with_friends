/**
 * @module containers/share_drafts
 */
import { connect } from 'react-redux';
import ShareDrafts from 'components/share_drafts';
import { getDrafts, shareDraft } from 'ducks';

function mapStateToProps( state ) {
	return {
		drafts: state.drafts.drafts,
		xhrRequest: state.drafts.isFetching,
	};
}

export default connect( mapStateToProps, {
	getDrafts,
	shareDraft,
} )( ShareDrafts );
