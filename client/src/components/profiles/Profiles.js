import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profileActions';

class Profiles extends Component {
	static propTypes = {
		profile: PropTypes.shape({}).isRequired,
		getProfiles: PropTypes.func.isRequired,
	};

	componentDidMount = () => {
		this.props.getProfiles();
	};

	render() {
		const { profiles, isLoading } = this.props.profile;
		let profileItems;

		if (profiles === null || isLoading) {
			profileItems = <Spinner />;
		} else {
			if (profiles.length) {
				profileItems = profiles.map(profile => (
					<ProfileItem profile={profile} key={profile._id} />
				));
			} else {
				profileItems = <h4>No profiles to display :( </h4>;
			}
		}

		return (
			<div className="profiles">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h1 className="display-4 text-center">Developer Profiles</h1>
							<p className="lead text-center">Browse and connect with developers</p>
							{profileItems}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
