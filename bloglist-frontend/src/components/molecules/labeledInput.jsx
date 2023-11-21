import React from 'react';
import { Input } from '../atoms/input';

export const LabeledInput = ({ label, type, name, value, onChange }) => {
	return (
		<div>
			<label>{label}</label>
			<Input type={type} name={name} value={value} onChange={onChange} />
		</div>
	);
};
