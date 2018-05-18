const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const keys = require('./keys');

const User = mongoose.model('User');

const options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secret;

module.exports = passport => {
	passport.use(
		new JwtStrategy(options, (jwt_payload, done) => {
			User.findById(jwt_payload.id)
				.then(user => {
					if (!user) return done(null, false);

					return done(null, user);
				})
				.catch(err => console.log(err));
		})
	);
};
