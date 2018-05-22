import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

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
								<div className="form-group">
									<input
										type="email"
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.email,
										})}
										placeholder="Email Address"
										name="email"
										value={this.state.email}
										onChange={this.onInputChange}
									/>
									{errors.email && (
										<p className="invalid-feedback">{errors.email}</p>
									)}
								</div>
								<div className="form-group">
									<input
										type="password"
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.password,
										})}
										placeholder="Password"
										name="password"
										value={this.state.password}
										onChange={this.onInputChange}
									/>
									{errors.password && (
										<p className="invalid-feedback">{errors.password}</p>
									)}
								</div>
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
