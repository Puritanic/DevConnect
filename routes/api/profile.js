const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

/**
 * @route   GET api/profiles/test
 * @desc    Tests profiles route
 * @access  Public
 */
router.get('/test', (req, res) =>
	res.json({
		msg: 'Profiles',
	})
);

/**
 * @route   GET api/profile
 * @desc    Get current users profile
 * @access  Private
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	Profile.findOne({ user: req.user.id })
		.populate('user', ['name', 'avatar']) // Populate with data from User Scheme that's connected through Profile Scheme
		.then(profile => {
			if (!profile) {
				errors.noProfile = 'There is no profile for this user';
				return res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch(err => res.status(404).json(err));
});

/**
 * @route   GET api/profile/all
 * @desc    Get all profiles
 * @access  Public
 */
router.get('/all', (req, res) => {
	const errors = {};
	Profile.find()
		.populate('user', ['name', 'avatar']) // Populate with data from User Scheme that's connected through Profile Scheme
		.then(profiles => {
			if (!profiles) {
				errors.noProfile = 'There are no profiles, or something bad just happened :(';
				return res.status(404).json(errors);
			}

			res.json(profiles);
		})
		.catch(() =>
			res
				.json(404)
				.json({ profile: 'There are no profiles, or something bad just happened :(' })
		);
});

/**
 * @route   GET api/profile/handle/:handle
 * @desc    Get profile by handle
 * @access  Public
 */
router.get('/handle/:handle', (req, res) => {
	const errors = {};
	Profile.findOne({ handle: req.params.handle })
		.populate('user', ['name', 'avatar']) // Populate with data from User Scheme that's connected through Profile Scheme
		.then(profile => {
			if (!profile) {
				errors.noProfile = 'There is no profile page for this user';
				return res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch(err => res.json(404).json(err));
});

/**
 * @route   GET api/profile/user/:user_id
 * @desc    Get profile by user id
 * @access  Public
 */
router.get('/user/:user_id', (req, res) => {
	const errors = {};
	Profile.findOne({ user: req.params.user_id })
		.populate('user', ['name', 'avatar']) // Populate with data from User Scheme that's connected through Profile Scheme
		.then(profile => {
			if (!profile) {
				errors.noProfile = 'There is no profile page for this user';
				return res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch(() => res.json(404).json({ profile: 'There is no profile page here' }));
});

/**
 * @route   Post api/profile
 * @desc    Create or update user profile
 * @access  Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateProfileInput(req.body);
	const {
		handle,
		company,
		website,
		location,
		bio,
		status,
		githubUsername,
		youTube,
		twitter,
		linkedIn,
		facebook,
		instagram,
	} = req.body;
	// Get profile fields
	const profileFields = {};
	// Check if input is valid
	if (!isValid) return res.status(400).json(errors);

	profileFields.user = req.user.id;

	if (handle) profileFields.handle = handle;
	if (company) profileFields.company = company;
	if (website) profileFields.website = website;
	if (location) profileFields.location = location;
	if (bio) profileFields.bio = bio;
	if (status) profileFields.status = status;
	if (githubUsername) profileFields.githubUsername = githubUsername;
	// Skills
	if (typeof req.body.skills !== 'undefined') {
		profileFields.skills = req.body.skills.split(',');
	}
	// Social
	profileFields.social = {};
	if (youTube) profileFields.social.youTube = youTube;
	if (twitter) profileFields.social.twitter = twitter;
	if (linkedIn) profileFields.social.linkedIn = linkedIn;
	if (facebook) profileFields.social.facebook = facebook;
	if (instagram) profileFields.social.instagram = instagram;

	Profile.findOne({ user: req.user.id })
		.then(profile => {
			if (!profile) {
				// Create
				// Check if handle exists
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					if (profile) {
						errors.handle = 'That handle already exists';
						return res.status(400).json(errors);
					}
					// Save profile
					return new Profile(profileFields).save().then(profile => res.json(profile));
				});
			}
			// Update
			Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			).then(profile => res.json(profile));
		})
		.catch(err => res.status(400).json(err));
});

/**
 * @route   POST api/profile/experience
 * @desc    Add experience to profile page
 * @access  Private
 */
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateExperienceInput(req.body);
	// Check if input is valid
	if (!isValid) return res.status(400).json(errors);

	Profile.findOne({ user: req.user.id })
		.then(profile => {
			if (!profile) {
				errors.noProfile = 'There is no profile page for this user';
				return res.status(404).json(errors);
			}

			const newExp = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description,
			};

			// Add to exp array
			profile.experience.unshift(newExp);
			profile.save().then(profile => res.json(profile));
		})
		.catch(() => res.json(404).json({ profile: 'There is no profile page here' }));
});

/**
 * @route   DELETE api/profile/experience/:id
 * @desc    Delete experience
 * @access  Private
 */
router.delete(
	'/experience/:exp_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const errors = {};

		Profile.findOne({ user: req.user.id })
			.then(profile => {
				if (!profile) {
					errors.noProfile = 'There is no profile page for this user';
					return res.status(404).json(errors);
				}
				// Instructors solution :P Mine's better
				// Get remove index
				// const removeIndex = profile.experience
				// 	.map(exp => exp.id)
				// 	.indexOf(req.params.exp_id);
				// // Splice it out of the array
				// profile.experience.splice(removeIndex, 1);
				const newExp = profile.experience.filter(exp => exp.id !== req.params.exp_id);
				profile.experience = newExp;
				profile.save().then(profile => res.json(profile));
			})
			.catch(() => res.json(404).json({ profile: 'Error while deleting experience' }));
	}
);

/**
 * @route   POST api/profile/education/:id
 * @desc    Add education to profile page
 * @access  Private
 */
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateEducationInput(req.body);
	// Check if input is valid
	if (!isValid) return res.status(400).json(errors);

	Profile.findOne({ user: req.user.id })
		.then(profile => {
			if (!profile) {
				errors.noProfile = 'There is no profile page for this user';
				return res.status(404).json(errors);
			}

			const newEdu = {
				school: req.body.school,
				degree: req.body.degree,
				fieldOfStudy: req.body.fieldOfStudy,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description,
			};

			// Add to edu array
			profile.education.unshift(newEdu);
			profile.save().then(profile => res.json(profile));
		})
		.catch(() => res.json(404).json({ profile: 'There is no profile page here' }));
});

/**
 * @route   DELETE api/profile/education
 * @desc    Delete education
 * @access  Private
 */
router.delete(
	'/education/:edu_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const errors = {};

		Profile.findOne({ user: req.user.id })
			.then(profile => {
				if (!profile) {
					errors.noProfile = 'There is no profile page for this user';
					return res.status(404).json(errors);
				}
				const newEdu = profile.education.filter(edu => edu.id !== req.params.edu_id);
				profile.education = newEdu;
				profile.save().then(profile => res.json(profile));
			})
			.catch(() => res.json(404).json({ profile: 'Error while deleting education' }));
	}
);

/**
 * @route   DELETE api/profile
 * @desc    Delete user and profile
 * @access  Private
 */
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) =>
	Profile.findOneAndRemove({ user: req.user.id })
		.then(() =>
			User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }))
		)
		.catch(() => res.json(404).json({ profile: 'Error while deleting profile' }))
);

module.exports = router;
