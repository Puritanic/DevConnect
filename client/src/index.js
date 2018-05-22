import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';

import './index.css';
import store from './store';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearProfile } from './actions/profileActions';

const Root = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

// Check for token
if (localStorage.getItem('jwtToken')) {
	// Set Auth token
	setAuthToken(localStorage.getItem('jwtToken'));
	// Decode token and get user info and expiration
	const decoded = jwtDecode(localStorage.getItem('jwtToken'));
	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));
	// Check for expired token
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		// Logout user if token has expired
		store.dispatch(logoutUser());
		// Clear current profile
		store.dispatch(clearProfile());
		// Redirect to login page
		window.location.href = '/login';
	}
}

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
