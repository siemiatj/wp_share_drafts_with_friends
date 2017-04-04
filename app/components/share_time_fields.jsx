import React from 'react';
import { Field } from 'redux-form';

const ShareTimeFields = () => (
	<div>
		<Field
			name="expire_time"
			component="input"
			type="text"
			size="4"
		/>
		<Field name="expire_unit" component="select" value={ 'minutes' }>
			<option value="s">seconds</option>
			<option value="m">minutes</option>
			<option value="h">hours</option>
			<option value="d">days</option>
		</Field>
	</div>
);

export default ShareTimeFields;
