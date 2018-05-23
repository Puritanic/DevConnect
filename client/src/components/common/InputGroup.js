import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const InputGroup = ({ name, type, placeholder, value, icon, error, onChange }) => {
	return (
		<div className="input-group mb-3">
			<div className="input-group-prepend">
				<span className="input-group-text">
					<i className={icon} />
				</span>
			</div>
			<input
				className={classnames('form-control form-control-lg', {
					'is-invalid': error,
				})}
				type={type}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
			/>
			{error && <p className="invalid-feedback">{error}</p>}
		</div>
	);
};

InputGroup.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	icon: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	error: PropTypes.string,
};

InputGroup.defaultProps = {
	type: 'text',
};

export default InputGroup;
