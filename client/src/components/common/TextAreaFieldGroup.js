import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TextAreaFieldGroup = ({ name, placeholder, value, error, info, onChange }) => {
	return (
		<div className="form-group">
			<textarea
				className={classnames('form-control form-control-lg', {
					'is-invalid': error,
				})}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
			/>
			{info && <small className="form-text text muted">{info}</small>}
			{error && <p className="invalid-feedback">{error}</p>}
		</div>
	);
};

TextAreaFieldGroup.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	error: PropTypes.string,
	info: PropTypes.string,
};

export default TextAreaFieldGroup;
