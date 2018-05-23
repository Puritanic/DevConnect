import axios from 'axios';
import types from './types';

const fetchProfile = () => ({
	type: types.PROFILE_LOADING,
});

export const clearProfile = () => ({
	type: types.CLEAR_PROFILE,
});

export const createProfile = (profileData, history) => dispatch =>
	axios
		.post('/api/profile', profileData)
		.then(res => history.push('/dashboard'))
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
