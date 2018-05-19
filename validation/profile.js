const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateProfileInput(data) {
	let errors = {};

	data.handle = !isEmpty(data.handle) ? data.handle : '';
	data.status = !isEmpty(data.status) ? data.status : '';
	data.skills = !isEmpty(data.skills) ? data.skills : '';

	if (!Validator.isLength(data.handle, { min: 4, max: 40 })) {
		errors.handle = 'Handle must have length between 4 and 40 characters';
	}
	if (Validator.isEmpty(data.handle)) {
		errors.handle = 'Profile handle is required';
	}

	if (Validator.isEmpty(data.status)) {
		errors.status = 'Status field is required';
	}

	if (Validator.isEmpty(data.skills)) {
		errors.skills = 'Skills field is required';
	}

	if (!isEmpty(data.website)) {
		if (!Validator.isURL(data.website)) {
			errors.website = 'Invalid URL';
		}
	}
	if (!isEmpty(data.twitter)) {
		if (!Validator.isURL(data.twitter)) {
			errors.twitter = 'Invalid URL';
		}
	}
	if (!isEmpty(data.linkedIn)) {
		if (!Validator.isURL(data.linkedIn)) {
			errors.linkedIn = 'Invalid URL';
		}
	}
	if (!isEmpty(data.youTube)) {
		if (!Validator.isURL(data.youTube)) {
			errors.youTube = 'Invalid URL';
		}
	}
	if (!isEmpty(data.instagram)) {
		if (!Validator.isURL(data.instagram)) {
			errors.instagram = 'Invalid URL';
		}
	}
	if (!isEmpty(data.facebook)) {
		if (!Validator.isURL(data.facebook)) {
			errors.facebook = 'Invalid URL';
		}
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
