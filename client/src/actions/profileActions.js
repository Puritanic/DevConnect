import axios from 'axios';
import types from './types';

const fetchProfile = () => ({
	type: types.PROFILE_LOADING,
});

export const clearProfile = () => ({
	type: types.CLEAR_PROFILE,
});

export const addExperience = (expData, history) => dispatch => {
	axios
		.post('/api/profile/experience', expData)
		.then(res => {
			dispatch({
				// TODO: Stupid err handling, going to refactor this later
				type: types.CLEAR_ERRORS,
			});
			history.push('/dashboard');
		})
		.catch(err => {
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			});
		});
};

export const addEducation = (eduData, history) => dispatch => {
	axios
		.post('/api/profile/education', eduData)
		.then(res => history.push('/dashboard'))
		.catch(err => {
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			});
		});
};

export const deleteEducation = id => dispatch => {
	axios
		.delete(`/api/profile/education/${id}`)
		.then(res => {
			dispatch({
				type: types.GET_PROFILE,
				payload: res.data,
			});
			dispatch({
				type: types.CLEAR_ERRORS,
			});
		})
		.catch(err => {
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			});
		});
};

export const deleteExperience = id => dispatch => {
	axios
		.delete(`/api/profile/experience/${id}`)
		.then(res => {
			dispatch({
				type: types.GET_PROFILE,
				payload: res.data,
			});
			dispatch({
				type: types.CLEAR_ERRORS,
			});
		})
		.catch(err => {
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			});
		});
};

// Delete acc and profile
export const deleteAccount = () => dispatch => {
	if (window.confirm("Are you sure? This can't be undone")) {
		axios
			.delete('/api/profile')
			.then(res => {
				dispatch({
					type: types.SET_CURRENT_USER,
					payload: {}, // because of auth reducer, if we send empty obj, isAuthenticated will be false
				});
				dispatch({
					type: types.CLEAR_ERRORS,
				});
			})
			.catch(err =>
				dispatch({
					type: types.GET_ERRORS,
					payload: err.response.data,
				})
			);
	}
};

export const createProfile = (profileData, history) => dispatch =>
	axios
		.post('/api/profile', profileData)
		.then(res => {
			dispatch({
				type: types.CLEAR_ERRORS,
			});
			history.push('/dashboard');
		})
		.catch(err => dispatch({ type: types.GET_ERRORS, payload: err.response.data }));

// Get current profile
export const getCurrentProfile = () => dispatch => {
	dispatch(fetchProfile());

	axios
		.get('/api/profile')
		.then(res =>
			dispatch({
				type: types.GET_PROFILE,
				payload: res.data,
			})
		)
		.catch(() =>
			dispatch({
				type: types.GET_PROFILE,
				payload: {},
			})
		);
};

export const getProfileByHandle = handle => dispatch => {
	dispatch(fetchProfile());

	axios
		.get(`/api/profile/handle/${handle}`)
		.then(res =>
			dispatch({
				type: types.GET_PROFILE,
				payload: res.data,
			})
		)
		.catch(() =>
			dispatch({
				type: types.GET_PROFILE,
				payload: {},
			})
		);
};

export const getProfiles = () => dispatch => {
	dispatch(fetchProfile());

	axios
		.get('/api/profile/all')
		.then(res =>
			dispatch({
				type: types.GET_PROFILES,
				payload: res.data,
			})
		)
		.catch(() =>
			dispatch({
				type: types.GET_PROFILES,
				payload: null,
			})
		);
};
