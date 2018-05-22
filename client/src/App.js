import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './App.css';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authActions';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Check for token
if (localStorage.getItem('jwtToken')) {
	// Set Auth token
	setAuthToken(localStorage.getItem('jwtToken'));
	// Decode token and get user info and expiration
	const decoded = jwtDecode(localStorage.getItem('jwtToken'));
	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<Navbar />
					<Route exact path="/" component={Landing} />
					<div className="container">
						<Route path="/register" component={Register} />
						<Route path="/login" component={Login} />
					</div>
					<Footer />
				</div>
			</Router>
		);
	}
}

export default App;
