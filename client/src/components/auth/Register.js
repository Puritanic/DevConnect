import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import TextFieldGroup from '../common/TextFieldGroup';
import { registerUser } from '../../actions/authActions';

export class Register extends Component {
	static propTypes = {
		errors: PropTypes.object,
		auth: PropTypes.shape({
			user: PropTypes.shape({}),
			isAuthenticated: PropTypes.bool,
		}).isRequired,
		registerUser: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			errors: {},
		};
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.errors) {
			return {
				errors: nextProps.errors,
			};
		}
	}

	onInputChange = e => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	};

	onSubmit = e => {
		e.preventDefault();
		const { name, email, password, password2 } = this.state;
		const newUser = {
			name,
			email,
			password,
			password2,
		};

		return this.props.registerUser(newUser, this.props.history);
	};

	render() {
		const { errors } = this.props;
		return (
			<div className="register">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Sign Up</h1>
							<p className="lead text-center">Create your DevConnector account</p>
							<form noValidate onSubmit={this.onSubmit} action="create-profile.html">
								<TextFieldGroup
									type="text"
									placeholder="Name"
									name="name"
									value={this.state.name}
									onChange={this.onInputChange}
									error={errors.name}
								/>
								<TextFieldGroup
									type="email"
									placeholder="Email Address"
									name="email"
									value={this.state.email}
									onChange={this.onInputChange}
									error={errors.email}
									info="This site uses Gravatar so if you want a profile image, use
								a Gravatar email"
								/>
								<TextFieldGroup
									type="password"
									placeholder="Password"
									name="password"
									value={this.state.password}
									onChange={this.onInputChange}
									error={errors.password}
								/>
								<TextFieldGroup
									type="password"
									placeholder="Confirm Password"
									name="password2"
									value={this.state.password2}
									onChange={this.onInputChange}
									error={errors.password2}
								/>
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

const mapDispatchToProps = dispatch => ({
	registerUser: (userData, redirect) => dispatch(registerUser(userData, redirect)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
