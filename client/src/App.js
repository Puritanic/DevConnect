import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/createProfile/CreateProfile';
import EditProfile from './components/editProfile/EditProfile';
import AddEducation from './components/addCredentials/AddEducation';
import AddExperience from './components/addCredentials/AddExperience';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import NotFound from './components/common/NotFound';
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
							<Route path="/profiles" component={Profiles} />
							<PrivateRoute path="/dashboard" component={Dashboard} />
							<PrivateRoute path="/create-profile" component={CreateProfile} />
							<PrivateRoute path="/edit-profile" component={EditProfile} />
							<PrivateRoute path="/add-exp" component={AddExperience} />
							<PrivateRoute path="/add-edu" component={AddEducation} />
							<PrivateRoute path="/feed" component={Posts} />
							<PrivateRoute path="/post/:id" component={Post} />
							<Route path="/profile/:handle" component={Profile} />
							<Route path="/404" component={NotFound} />
							<Route component={NotFound} />
						</Switch>
					</div>
					<Footer />
				</div>
			</Router>
		);
	}
}

export default App;
