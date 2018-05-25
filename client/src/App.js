import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/createProfile/CreateProfile';
import EditProfile from './components/editProfile/EditProfile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<Navbar />
					<Route exact path="/" component={Landing} />
					<div className="container">
						<Switch>
							<Route path="/register" component={Register} />
							<Route path="/login" component={Login} />
							<PrivateRoute path="/dashboard" component={Dashboard} />
							<PrivateRoute path="/create-profile" component={CreateProfile} />
							<PrivateRoute path="/edit-profile" component={EditProfile} />
						</Switch>
					</div>
					<Footer />
				</div>
			</Router>
		);
	}
}

export default App;
