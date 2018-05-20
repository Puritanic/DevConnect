import axios from 'axios';
import jwtDecode from 'jwt-decode';

import types from './types';
import setAuthToken from '../utils/setAuthToken';

export const registerUser = (userData, redirect) => dispatch =>
	axios
		.post('/api/users/register', userData)
		.then(() => redirect.push('/login'))
		.catch(err =>
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			})
		);

const setCurrentUser = decodedUser => ({
	type: types.SET_CURRENT_USER,
	payload: decodedUser,
});

export const loginUser = userData => dispatch => {
	axios
		.post('/api/users/login', userData)
		.then(res => {
			// Save to local storage
			const { token } = res.data;
			localStorage.setItem({ token });
			// Set token to Auth header
			setAuthToken(token);
			// Decode token to get user data
			const decoded = jwtDecode(token);
			// Set current user
			return dispatch(setCurrentUser(decoded));
		})
		.catch(err =>
			dispatch({
				type: types.GET_ERRORS,
				payload: err.response.data,
			})
		);
};
