const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();

const validateProfileInput = require('../../validation/profile');
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
 * @desc    GEt all profiles
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
 * @desc    GEt profile by handle
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
 * @desc    GEt profile by user id
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

module.exports = router;
