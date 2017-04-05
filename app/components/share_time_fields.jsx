import React from 'react';
import { Field } from 'redux-form';

const ShareTimeFields = () => (
	<div className="form-time-fields">
		<Field
			name="expire_time"
			component="input"
			type="text"
			size="4"
		/>
		<Field name="expire_unit" component="select" value={ 'minutes' }>
			<option value="s">{ APP_DATA.translations[ 'share_time_fields-s' ] }</option>
			<option value="m">{ APP_DATA.translations[ 'share_time_fields-m' ] }</option>
			<option value="h">{ APP_DATA.translations[ 'share_time_fields-h' ] }</option>
			<option value="d">{ APP_DATA.translations[ 'share_time_fields-d' ] }</option>
		</Field>
	</div>
);

export default ShareTimeFields;
