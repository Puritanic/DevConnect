const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

const router = express.Router();

/**
 * @route   GET api/users/test
 * @desc    Tests users route
 * @access  Public
 */
router.get('/test', (req, res) =>
	res.json({
		msg: 'Users',
	})
);

/**
 * @route   GET api/users/register
 * @desc    Registers User
 * @access  Public
 */
router.post('/register', (req, res) =>
	User.findOne({
		email: req.body.email,
	}).then(user => {
		if (user) {
			return res.status(400).json({
				email: 'Email is not valid',
			});
		}

		const { name, email, password } = req.body;
		const avatar = gravatar.url(email, {
			s: '200', // Size
			r: 'pg', // Rating
			d: 'mm', // Default
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
					.catch(e => console.log(e));
			});
		});
	})
);

/**
 * @route   GET api/users/login
 * @desc    Login User / Returning JWT token
 * @access  Public
 */
router.post('/login', (req, res) => {
	const { email, password } = req.body;
	// Find user by mail
	User.findOne({
		email,
	}).then(user => {
		// Check for user
		if (!user) {
			return res.status(404).json({
				email: 'User not found',
			});
		}

		// Check password
		bcrypt.compare(password, user.password).then(isMatch => {
			if (!isMatch) {
				return res.status(400).json({
					password: 'Wrong credentials',
				});
			}

			res.json({
				msg: 'success',
			});
		});
	});
});

module.exports = router;
