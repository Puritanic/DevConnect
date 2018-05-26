import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class ProfileGithub extends Component {
	static propTypes = {
		username: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			clientId: 'cda6557d4c69fbdff884',
			clientSecret: 'beeea8e35d1642ce82b84ab925ab55b0e8b98323',
			count: 5,
			sort: 'created: asc',
			repos: [],
		};

		this.ghRef = null;
	}

	componentDidMount() {
		const { username } = this.props;
		const { count, sort, clientId, clientSecret } = this.state;

		fetch(
			`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
		)
			.then(res => res.json())
			.then(data => {
				if (this.ghRef) {
					this.setState({ repos: data });
				}
			})
			.catch(err => console.log(err));
	}

	render() {
		const { repos } = this.state;

		const repoItems = repos.map(repo => (
			<div key={repo.id} className="card card-body mb-2">
				<div className="row">
					<div className="col-md-6">
						<h4>
							<Link to={repo.html_url} className="text-info" target="_blank">
								{repo.name}
							</Link>
						</h4>
						<p>{repo.description}</p>
					</div>
					<div className="col-md-6">
						<span className="badge badge-info mr-1">
							Stars: {repo.stargazers_count}
						</span>
						<span className="badge badge-secondary mr-1">
							Watchers: {repo.watchers_count}
						</span>
						<span className="badge badge-success">Forks: {repo.forks_count}</span>
					</div>
				</div>
			</div>
		));
		return (
			<div
				ref={el => {
					this.ghRef = el;
				}}
			>
				<hr />
				<h3 className="mb-4">Latest Github Repos</h3>
				{repoItems}
			</div>
		);
	}
}

export default ProfileGithub;
