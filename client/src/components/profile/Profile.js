import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Spinner from '../common/Spinner';
import ProfileHeader from './ProfileHeader';
import ProfileGithub from './ProfileGithub';
import ProfileCreds from './ProfileCreds';
import ProfileAbout from './ProfileAbout';
import { getProfileByHandle } from '../../actions/profileActions';

export class Profile extends Component {
	static propTypes = {
		profile: PropTypes.shape({}).isRequired,
		getProfileByHandle: PropTypes.func.isRequired,
	};

	componentDidMount = () => {
		if (this.props.match.params.handle) {
			this.props.getProfileByHandle(this.props.match.params.handle);
		}
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.profile.profile === null && !this.props.profile.loading) {
			this.props.history.push('/404');
		}
	}

	render() {
		const { profile, isLoading } = this.props.profile;
		let profileContent;

		if (profile === null || isLoading) {
			profileContent = <Spinner />;
		} else {
			profileContent = (
				<div>
					<div className="row">
						<div className="col-md-6">
							<Link to="/profiles" className="btn btn-light mb-3 float-left">
								Back To Profiles
							</Link>
						</div>
						<div className="col-md-6" />
					</div>
					<ProfileHeader profile={profile} />
					<ProfileAbout profile={profile} />
					<ProfileCreds education={profile.education} experience={profile.experience} />
					{profile.githubUsername ? (
						<ProfileGithub username={profile.githubUsername} />
					) : null}
				</div>
			);
		}
		return (
			<div className="profile">
				<div className="container">
					<div className="row">
						<div className="col-md-12">{profileContent}</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	profile: state.profile,
});

export default connect(mapStateToProps, { getProfileByHandle })(Profile);
