require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//configuration
const { PORT, CLIENT_ORIGIN } = require('./config');

//API routes
const apiRouter = require('./routes');

//Passport setup
const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');
passport.use(localStrategy);
passport.use(jwtStrategy);

const app = express();

app.use(morgan(process.env.NODE_ENV !== 'development'? 'common':'dev', {
	skip: () => process.env.NODE_ENV === 'test'
}));

app.use(express.json());

//Provide CORS support
app.use(
	cors({
		origin: CLIENT_ORIGIN
	})
);

//Router
app.use('/api', apiRouter);


//404 error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//Catch-all error handler
app.use((err,req,res,next) => {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: app.get('env') === 'development' ? err : {}
	});
});


if(require.main === module) {
	app.listen(PORT, function() {
		console.log(`Express server running on localhost:${this.address().port}`);
	})
		.on('error', err => {
			console.error('Express failed to start');
			console.error(err);
		});
}

module.exports = app;
