import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCurrentProfile } from '../../actions/profileActions';
import Spinner from '../common/Spinner';

export class Dashboard extends Component {
	static propTypes = {
		getCurrentProfile: PropTypes.func.isRequired,
		profile: PropTypes.shape({
			profile: PropTypes.any,
			isLoading: PropTypes.bool,
		}).isRequired,
		auth: PropTypes.shape({
			user: PropTypes.shape({
				name: PropTypes.string.isRequired,
			}),
		}).isRequired,
	};

	componentDidMount = () => {
		this.props.getCurrentProfile();
	};

	render() {
		const { user } = this.props.auth;
		const { profile, isLoading } = this.props.profile;

		let content;

		if (profile === null || isLoading) {
			content = <Spinner />;
		} else if (!Object.keys(profile).length) {
			// User is logged in, but has no profile
			content = (
				<div>
					<p className="lead text-muted">Welcome {user.name}</p>
					<p>You havet yet set a profile, feel free to add some info.</p>
					<Link to="/create-profile" className="btn btn-lg btn-info">
						Create Profile
					</Link>
				</div>
			);
		} else {
			content = 'Profile there is';
		}

		return (
			<div className="dashboard">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h1 className="display-4">Dashboard</h1>
							{content}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ profile, auth }) => ({
	profile,
	auth,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
