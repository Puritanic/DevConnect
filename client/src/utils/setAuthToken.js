import axios from 'axios';

const setAuthToken = token => {
	// If no token delete it from header
	if (!token) return delete axios.defaults.headers.common['Authorization'];

	// Apply to every request
	axios.defaults.headers.common['Authorization'] = token;
};

export default setAuthToken;
