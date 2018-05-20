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

/**
 * @route   POST api/posts/like/:id
 * @desc    Like post
 * @access  Private
 */
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id }).then(profile =>
		Post.findById(req.params.id)
			.then(post => {
				if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
					return res.status(400).json({ alreadyLiked: 'User already liked this post' });
				}

				// Add user id to likes array
				post.likes.unshift({ user: req.user.id });
				post.save().then(post => res.json(post));
			})
			.catch(err => res.status(404).json({ postNotFound: 'No post found', devMsg: err }))
	);
});

/**
 * @route   POST api/posts/unlike/:id
 * @desc    Unlike post
 * @access  Private
 */
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id }).then(profile =>
		Post.findById(req.params.id)
			.then(post => {
				if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
					return res.status(400).json({ notLiked: "User haven't liked this post" });
				}

				// Remove user from like array
				post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
				post.save().then(post => res.json(post));
			})
			.catch(err => res.status(404).json({ postNotFound: 'No post found', devMsg: err }))
	);
});

/**
 * @route   POST api/posts/comment/:post_id
 * @desc    Add comment to post
 * @access  Private
 */
router.post('/comment/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);
	// Check if input is valid
	if (!isValid) return res.status(400).json(errors);

	Post.findById(req.params.post_id)
		.then(post => {
			const newComment = {
				user: req.user.id,
				name: req.user.name,
				avatar: req.user.avatar,
				text: req.body.text,
			};

			// Add to comments array
			post.comments.unshift(newComment);
			// Save
			post
				.save()
				.then(post => res.json(post))
				.catch(err =>
					res.status(404).json({ postNotFound: 'Post not found', devMsg: err })
				);
		})
		.catch(err => res.status(404).json({ postNotFound: 'Post not found', devMsg: err }));
});

/**
 * @route   DELETE api/posts/comment/:post_id/:comment_id
 * @desc   	Delete comment from post
 * @access  Private
 */
router.delete(
	'/comment/:post_id/:comment_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.findById(req.params.post_id)
			.then(post => {
				// Check if comment exists
				if (
					post.comments.filter(
						comment => comment._id.toString() === req.params.comment_id
					).length === 0
				) {
					return res.status(404).json({ commentNotExists: "Can't find that comment" });
				}

				// Remove comment from comments array
				post.comments = post.comments.filter(
					comment => comment._id.toString() !== req.params.comment_id
				);
				post
					.save()
					.then(updatedPost => res.json(updatedPost))
					.catch(err =>
						res.json({ errHappened: 'Somethings wrong, please try again', devMsg: err })
					);
			})
			.catch(err => res.status(404).json({ postNotFound: 'Post not found', devMsg: err }));
	}
);

module.exports = router;
