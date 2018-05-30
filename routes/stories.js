
const router = require('express').Router();

//TODO make a basic request from a router
router.get('/', (req, res, next) => {
	const { username } = req.user;
	res.status(201).json(`Hey ${username}! you got to this endpoint!`);
});


module.exports = router;