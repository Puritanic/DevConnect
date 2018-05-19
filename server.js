const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
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
app.use('/api/profile', profiles);
app.use('/api/posts', posts);

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
