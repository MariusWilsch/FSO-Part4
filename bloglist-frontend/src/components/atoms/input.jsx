import React from 'react';

export const Input = ({ type, name, value, onChange }) => {
	return <input type={type} name={name} value={value} onChange={onChange} />;
};
