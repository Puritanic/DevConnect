import axios from 'axios';
import types from './types';

export const addPost = postData => dispatch => {
	axios
		.post('/api/posts', postData)
		.then(res => {
			dispatch({
				type: types.ADD_POST,
				payload: res.data,
			});
		})
		.catch(err => {
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			});
		});
};

export const getPosts = () => dispatch => {
	dispatch(fetchPosts());
	return axios
		.get('/api/posts')
		.then(res => {
			dispatch({
				type: types.GET_POSTS,
				payload: res.data,
			});
		})
		.catch(err => {
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			});
		});
};

export const fetchPosts = dispatch => ({
	type: types.POST_LOADING,
});

export const deletePost = postId => dispatch =>
	axios
		.delete(`/api/posts/${postId}`)
		.then(res => {
			dispatch({
				type: types.DELETE_POST,
				payload: postId,
			});
		})
		.catch(err => {
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			});
		});

export const addLike = postId => dispatch =>
	axios
		.post(`/api/posts/like/${postId}`)
		.then(res => {
			dispatch(getPosts());
		})
		.catch(err => {
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			});
		});

export const removeLike = postId => dispatch =>
	axios
		.post(`/api/posts/unlike/${postId}`)
		.then(res => {
			dispatch(getPosts());
		})
		.catch(err => {
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			});
		});
