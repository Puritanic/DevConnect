const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const PORT = process.env.PORT || 5050;

const app = express();

app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());

// DB Config
const DB = require('./config/keys').mongoURI;

// Passport config
app.use(passport.initialize());
require('./config/passport')(passport);
mongoose
	.connect(DB)
	.then(() => console.log('MongoDB connected'))
	.catch(err => {
		throw new Error(err);
	});

app.get('/', (req, res) => {
	res.send('Hello!');
});

// Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
