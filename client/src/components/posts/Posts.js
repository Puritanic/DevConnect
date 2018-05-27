import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPosts } from '../../actions/postActions';
import Spinner from '../common/Spinner';
import PostForm from './PostForm';
import PostFeed from './PostFeed';

class Posts extends Component {
	static propTypes = {
		post: PropTypes.shape({}),
		getPosts: PropTypes.func.isRequired,
	};

	componentDidMount = () => {
		this.props.getPosts();
	};

	render() {
		const { posts, loading } = this.props.posts;
		let postContent;

		if (posts === null || loading) {
			postContent = <Spinner />;
		} else {
			postContent = <PostFeed posts={posts} />;
		}

		return (
			<div className="feed">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<PostForm />
							{postContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	posts: state.posts,
});

export default connect(mapStateToProps, { getPosts })(Posts);
