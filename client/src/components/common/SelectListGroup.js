import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const SelectListGroup = ({ name, value, error, info, onChange, options }) => {
	const selectOptions = options.map(option => (
		<option key={option.label} value={option.value}>
			{option.label}
		</option>
	));

	return (
		<div className="form-group">
			<select
				className={classnames('form-control form-control-lg', {
					'is-invalid': error,
				})}
				name={name}
				value={value}
				onChange={onChange}
			>
				{selectOptions}
			</select>
			{info && <small className="form-text text muted">{info}</small>}
			{error && <p className="invalid-feedback">{error}</p>}
		</div>
	);
};

SelectListGroup.propTypes = {
	options: PropTypes.arrayOf(PropTypes.object).isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	error: PropTypes.string,
	info: PropTypes.string,
};

export default SelectListGroup;
