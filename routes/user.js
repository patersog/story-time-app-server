
const router = require('express').Router();

//TODO make a basic request from a router
router.get('/', (req, res, next) => {
	res.status(201).json('Hey, username or fullname, you got to this endpoint!');
});


module.exports = { router };