import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { createProfile, getCurrentProfile } from '../../actions/profileActions';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import isEmpty from '../../utils/isEmpty';

class EditProfile extends Component {
	static propTypes = {
		profile: PropTypes.shape({}),
		errors: PropTypes.shape({}),
		getCurrentProfile: PropTypes.func.isRequired,
		createProfile: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			bio: '',
			company: '',
			facebook: '',
			githubUsername: '',
			handle: '',
			instagram: '',
			linkedIn: '',
			location: '',
			skills: '',
			status: '',
			twitter: '',
			website: '',
			youTube: '',
			errors: {},
			fetched: false,
			isSocialVisible: false,
		};
	}

	componentDidMount() {
		this.props.getCurrentProfile();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!isEmpty(nextProps.errors)) {
			return {
				errors: nextProps.errors,
			};
		}
		if (nextProps.profile.profile && !prevState.fetched) {
			// TODO: Fix redux architecture! Look at this shit damn
			const { social, user, ...restProfile } = nextProps.profile.profile;
			const profile = { ...restProfile, ...social };
			const newState = {};

			// Check if skills is array, and turn them into CSV
			if (profile.skills.constructor === Array) {
				profile.skills = profile.skills.join(',');
			}
			// If profile field doesn't exists, make empty string
			Object.keys(prevState).map(val => {
				if (val !== 'errors') {
					if (isEmpty(profile[val])) {
						newState[val] = '';
					} else {
						newState[val] = profile[val];
					}
				}
				return null;
			});
			newState.fetched = true;
			return newState;
		}
		return null;
	}

	onSubmit = e => {
		e.preventDefault();
		const { errors, fetched, isSocialVisible, ...userData } = this.state;

		return this.props.createProfile(userData, this.props.history);
	};

	onChange = e => {
		const { name, value } = e.target;
		return this.setState({ [name]: value });
	};

	onDisplaySocial = () =>
		this.setState(prevState => ({
			displaySocialInputs: !prevState.displaySocialInputs,
		}));

	render() {
		const { errors, displaySocialInputs } = this.state;

		let socialInputs;

		if (displaySocialInputs) {
			socialInputs = (
				<div>
					<InputGroup
						placeholder="Twitter Profile URL"
						name="twitter"
						icon="fab fa-twitter"
						value={this.state.twitter}
						onChange={this.onChange}
						error={errors.twitter}
					/>

					<InputGroup
						placeholder="Facebook Page URL"
						name="facebook"
						icon="fab fa-facebook"
						value={this.state.facebook}
						onChange={this.onChange}
						error={errors.facebook}
					/>

					<InputGroup
						placeholder="Linkedin Profile URL"
						name="linkedIn"
						icon="fab fa-linkedin"
						value={this.state.linkedIn}
						onChange={this.onChange}
						error={errors.linkedIn}
					/>

					<InputGroup
						placeholder="YouTube Channel URL"
						name="youTube"
						icon="fab fa-youtube"
						value={this.state.youTube}
						onChange={this.onChange}
						error={errors.youTube}
					/>

					<InputGroup
						placeholder="Instagram Page URL"
						name="instagram"
						icon="fab fa-instagram"
						value={this.state.instagram}
						onChange={this.onChange}
						error={errors.instagram}
					/>
				</div>
			);
		}

		// Select options for status
		const options = [
			{ label: '* Select Professional Status', value: 0 },
			{ label: 'Developer', value: 'Developer' },
			{ label: 'Junior Developer', value: 'Junior Developer' },
			{ label: 'Senior Developer', value: 'Senior Developer' },
			{ label: 'Manager', value: 'Manager' },
			{ label: 'Student or Learning', value: 'Student or Learning' },
			{ label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
			{ label: 'Intern', value: 'Intern' },
			{ label: 'Other', value: 'Other' },
		];
		return (
			<div className="create-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">
								Go Back
							</Link>
							<h1 className="display-4 text-center">Edit Your Profile</h1>
							<small className="d-block pb-3">* required fields</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Profile Handle"
									name="handle"
									value={this.state.handle}
									onChange={this.onChange}
									error={errors.handle}
									info="A unique handle for your profile URL. Your full name, company name, nickname"
								/>
								<SelectListGroup
									placeholder="Status"
									name="status"
									value={this.state.status}
									onChange={this.onChange}
									options={options}
									error={errors.status}
									info="Give us an idea of where you are at in your career"
								/>
								<TextFieldGroup
									placeholder="Company"
									name="company"
									value={this.state.company}
									onChange={this.onChange}
									error={errors.company}
									info="Could be your own company or one you work for"
								/>
								<TextFieldGroup
									placeholder="Website"
									name="website"
									value={this.state.website}
									onChange={this.onChange}
									error={errors.website}
									info="Could be your own website or a company one"
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={this.state.location}
									onChange={this.onChange}
									error={errors.location}
									info="City or city & state suggested (eg. Boston, MA)"
								/>
								<TextFieldGroup
									placeholder="* Skills"
									name="skills"
									value={this.state.skills}
									onChange={this.onChange}
									error={errors.skills}
									info="Please use comma separated values (eg.HTML,CSS,JavaScript,PHP)"
								/>
								<TextFieldGroup
									placeholder="Github Username"
									name="githubUsername"
									value={this.state.githubUsername}
									onChange={this.onChange}
									error={errors.githubUsername}
									info="If you want your latest repos and a Github link, include your username"
								/>
								<TextAreaFieldGroup
									placeholder="Short Bio"
									name="bio"
									value={this.state.bio}
									onChange={this.onChange}
									error={errors.bio}
									info="Tell us a little about yourself"
								/>

								<div className="mb-3">
									<button
										type="button"
										onClick={this.onDisplaySocial}
										className="btn btn-light"
									>
										Add Social Network Links
									</button>
									<span className="text-muted">&nbsp;Optional</span>
								</div>
								{socialInputs}
								<input
									type="submit"
									value="Submit"
									className="btn btn-info btn-block mt-4"
								/>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ profile, errors }) => ({ profile, errors });

export default withRouter(
	connect(mapStateToProps, { createProfile, getCurrentProfile })(EditProfile)
);
