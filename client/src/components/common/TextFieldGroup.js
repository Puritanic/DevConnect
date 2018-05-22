import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TextFieldGroup = ({
	name,
	placeholder,
	value,
	label,
	error,
	info,
	type,
	onChange,
	disabled,
}) => {
	return (
		<div className="form-group">
			<input
				type={type}
				className={classnames('form-control form-control-lg', {
					'is-invalid': error,
				})}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
			{info && <small className="form-text text muted">{info}</small>}
			{error && <p className="invalid-feedback">{error}</p>}
		</div>
	);
};

TextFieldGroup.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	label: PropTypes.string,
	error: PropTypes.string,
	info: PropTypes.string,
	disabled: PropTypes.bool,
};

TextFieldGroup.defaultProps = {
	type: 'text',
};

export default TextFieldGroup;
