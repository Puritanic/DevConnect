const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');
const keys = require('../../config/keys');

const router = express.Router();

/**
 * @route   POST api/users/register
 * @desc    Registers User
 * @access  Public
 */
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	// Validate request body
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({
		email: req.body.email,
	})
		.then(user => {
			if (user) {
				errors.email = 'Email is not valid';
				return res.status(400).json(errors);
			}

			const { name, email, password } = req.body;
			const avatar = gravatar.url(email, {
				s: '200', // Size
				r: 'pg', // Rating
				d: 'retro', // Default
			});
			const newUser = new User({
				name,
				email,
				avatar,
				password,
			});

			bcrypt.genSalt(10, (error, salt) => {
				if (error) throw error;

				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;

					newUser.password = hash;
					newUser
						.save()
						.then(savedUser => res.json(savedUser))
						.catch(console.log);
				});
			});
		})
		.catch(err => res.status(400).json(err));
});

/**
 * @route   POST api/users/login
 * @desc    Login User / Returning JWT token
 * @access  Public
 */

router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	const { email, password } = req.body;

	// Validate request body
	if (!isValid) {
		return res.status(400).json(errors);
	}

	// Find user by mail
	User.findOne({
		email,
	})
		.then(user => {
			// Check for user
			if (!user) {
				errors.email = 'User not found';
				return res.status(404).json(errors);
			}

			// Check password
			bcrypt.compare(password, user.password).then(isMatch => {
				if (!isMatch) {
					errors.password = 'Wrong credentials';
					return res.status(400).json(errors);
				}
				// Pass good, create JWT payload
				const payload = {
					id: user.id,
					name: user.name,
					avatar: user.avatar,
				};

				// Sign token
				return jwt.sign(
					payload,
					keys.secret,
					{
						expiresIn: 3600,
					},
					(err, token) =>
						res.json({
							success: true,
							token: `Bearer ${token}`,
						})
				);
			});
		})
		.catch(err => res.status(400).json(err));
});

/**
 * @route   GET api/users/current
 * @desc    Return current User
 * @access  Private
 */
router.get(
	'/current',
	passport.authenticate('jwt', {
		session: false,
	}),
	(req, res) => {
		res.json(req.user);
	}
);

module.exports = router;
