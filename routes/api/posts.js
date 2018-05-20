const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');

/**
 * @route   GET api/posts
 * @desc    Get posts
 * @access  Public
 */
router.get('/', (req, res) =>
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err =>
			res
				.status(404)
				.json({ noPostsFound: 'No posts, or something bad happened :(', devMsg: err })
		)
);

/**
 * @route   GET api/posts/:post_id
 * @desc    Get specific post by id
 * @access  Public
 */
router.get('/:post_id', (req, res) => {
	Post.findById(req.params.post_id)
		.then(post => res.json(post))
		.catch(err =>
			res.status(404).json({ noPostFound: "We couldn't find post with that ID", devMsg: err })
		);
});

/**
 * @route   POST api/posts
 * @desc    Create new post
 * @access  Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);
	const { id, name, avatar } = req.user;
	const newPost = new Post({
		text: req.body.text,
		user: id,
		name,
		avatar,
	});
	// Check if input is valid
	if (!isValid) return res.status(400).json(errors);

	newPost
		.save()
		.then(post => res.json(post))
		.catch(err => res.status(400).json(err));
});

/**
 * @route   DELETE api/posts/:post_id
 * @desc    Delete post by id
 * @access  Private
 */
router.delete('/:post_id', passport.authenticate('jwt', { session: false }), (req, res) =>
	Profile.findOne({ user: req.user.id }).then(profile => {
		if (!profile) return res.status(404);

		Post.findById(req.params.post_id)
			.then(post => {
				// Check for post owner
				if (post.user.toString() !== req.user.id)
					return res.status(401).json({ notAuthorized: 'Not authorized to do that' });

				// Delete post
				post
					.remove()
					.then(() => res.json({ success: 'Post deleted' }))
					.catch(err =>
						res.status(404).json({ postNotFound: 'Post not found', devMsg: err })
					);
			})
			.catch(err => res.status(404).json({ postNotFound: 'Post not found', devMsg: err }));
	})
);

module.exports = router;
