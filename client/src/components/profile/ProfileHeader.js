import React, { Component } from 'react';
import PropTypes from 'prop-types';

import isEmpty from '../../utils/isEmpty';

class ProfileHeader extends Component {
	static propTypes = {
		profile: PropTypes.shape({
			user: PropTypes.shape({
				avatar: PropTypes.string,
				name: PropTypes.string.isRequired,
			}),
			status: PropTypes.string,
			company: PropTypes.string,
			location: PropTypes.string,
			website: PropTypes.string,
			social: PropTypes.shape({
				twitter: PropTypes.string,
				facebook: PropTypes.string,
				linkedIn: PropTypes.string,
				youTube: PropTypes.string,
				instagram: PropTypes.string,
			}),
		}),
	};

	render() {
		const { profile } = this.props;
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="card card-body bg-info text-white mb-3">
						<div className="row">
							<div className="col-4 col-md-3 m-auto">
								<img className="rounded-circle" src={profile.user.avatar} alt="" />
							</div>
						</div>
						<div className="text-center">
							<h1 className="display-4 text-center">{profile.user.name}</h1>
							<p className="lead text-center">
								{profile.status}{' '}
								{isEmpty(profile.company) ? null : (
									<span>at {profile.company}</span>
								)}
							</p>
							{isEmpty(profile.location) ? null : <p>{profile.location}</p>}
							<p>
								{isEmpty(profile.website) ? null : (
									<a
										className="text-white p-2"
										href={profile.website}
										target="_blank"
									>
										<i className="fas fa-globe fa-2x" />
									</a>
								)}

								{isEmpty(profile.social && profile.social.twitter) ? null : (
									<a
										className="text-white p-2"
										href={profile.social.twitter}
										target="_blank"
									>
										<i className="fab fa-twitter fa-2x" />
									</a>
								)}

								{isEmpty(profile.social && profile.social.facebook) ? null : (
									<a
										className="text-white p-2"
										href={profile.social.facebook}
										target="_blank"
									>
										<i className="fab fa-facebook fa-2x" />
									</a>
								)}

								{isEmpty(profile.social && profile.social.linkedIn) ? null : (
									<a
										className="text-white p-2"
										href={profile.social.linkedIn}
										target="_blank"
									>
										<i className="fab fa-linkedin fa-2x" />
									</a>
								)}

								{isEmpty(profile.social && profile.social.youTube) ? null : (
									<a
										className="text-white p-2"
										href={profile.social.youTube}
										target="_blank"
									>
										<i className="fab fa-youtube fa-2x" />
									</a>
								)}

								{isEmpty(profile.social && profile.social.instagram) ? null : (
									<a
										className="text-white p-2"
										href={profile.social.instagram}
										target="_blank"
									>
										<i className="fab fa-instagram fa-2x" />
									</a>
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfileHeader;
