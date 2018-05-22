import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextFieldGroup from '../common/TextFieldGroup';
import { loginUser } from '../../actions/authActions';

export class Login extends Component {
	static propTypes = {
		loginUser: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			errors: {},
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.errors) {
			return {
				errors: nextProps.errors,
			};
		}
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.auth.isAuthenticated !== this.props.auth.isAuthenticated) {
			return this.props.history.push('/dashboard');
		}
	};

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	onInputChange = e => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	};

	onSubmit = e => {
		e.preventDefault();
		const { email, password } = this.state;
		const user = {
			email,
			password,
		};
		return this.props.loginUser(user);
	};

	render() {
		const { errors } = this.state;
		return (
			<div className="login">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Log In</h1>
							<p className="lead text-center">Sign in to your DevConnector account</p>
							<form noValidate onSubmit={this.onSubmit} action="dashboard.html">
								<TextFieldGroup
									type="email"
									placeholder="Email Address"
									name="email"
									value={this.state.email}
									onChange={this.onInputChange}
									error={errors.email}
								/>
								<TextFieldGroup
									type="password"
									placeholder="Password"
									name="password"
									value={this.state.password}
									onChange={this.onInputChange}
									error={errors.password}
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

export default connect(mapStateToProps, { loginUser })(Login);
