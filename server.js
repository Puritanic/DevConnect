const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5050;

const app = express();

// DB Config
const DB = require('./config/keys').mongoURI;

mongoose
	.connect(DB)
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err));

app.get('/', (req, res) => {
	res.send('Hello!');
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
