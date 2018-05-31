
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');

const localAuth = passport.authenticate('local', {session: false});
const jwtAuth = passport.authenticate('jwt', {session: false});

const createAuthToken = function(user) {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

router.post('/login', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
	res.json({authToken});
});

router.post('/refresh', jwtAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
	res.json({authToken});
});


module.exports = router;