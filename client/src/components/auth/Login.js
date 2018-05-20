import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export class Login extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			errors: {},
		};
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
		console.log(user);
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
							<form novalidate onSubmit={this.onSubmit} action="dashboard.html">
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
									{errors.name && (
										<p className="invalid-feedback">{errors.name}</p>
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

export default Login;
