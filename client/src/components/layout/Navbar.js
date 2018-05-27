/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutUser } from '../../actions/authActions';

class Navbar extends Component {
	static propTypes = {
		logoutUser: PropTypes.func.isRequired,
		auth: PropTypes.shape({
			isAuthenticated: PropTypes.bool,
			user: PropTypes.shape({}),
		}).isRequired,
	};

	onLogout = e => {
		e.preventDefault();
		this.props.logoutUser();
		// Redirect to login page
		// this.props.history.push('/login');
	};

	render() {
		const { isAuthenticated, user } = this.props.auth;

		const avatarStyle = {
			width: '25px',
			marginRight: '5px',
		};

		const authLinks = (
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<NavLink to="/feed" className="nav-link">
						Post Feed
					</NavLink>
				</li>
				<li className="nav-item">
					<a href="#" onClick={this.onLogout} className="nav-link">
						<img
							src={user.avatar}
							className="rounded-circle"
							style={avatarStyle}
							alt="User avatar"
							title="You must have gravatar connected mail to display image"
						/>
						Logout
					</a>
				</li>
			</ul>
		);

		const guestLinks = (
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<NavLink to="/register" className="nav-link">
						Sign Up
					</NavLink>
				</li>
				<li className="nav-item">
					<NavLink to="/login" className="nav-link">
						Login
					</NavLink>
				</li>
			</ul>
		);

		return (
			<nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
				<div className="container">
					<NavLink to="/" className="navbar-brand">
						DevConnector
					</NavLink>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#mobile-nav"
					>
						<span className="navbar-toggler-icon" />
					</button>

					<div className="collapse navbar-collapse" id="mobile-nav">
						<ul className="navbar-nav mr-auto">
							<li className="nav-item">
								<NavLink to="/profiles" className="nav-link">
									Developers
								</NavLink>
							</li>
						</ul>
						{isAuthenticated ? authLinks : guestLinks}
					</div>
				</div>
			</nav>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default withRouter(connect(mapStateToProps, { logoutUser })(Navbar));
