const router = require('express').Router();
const bodyParser = require('body-parser');
const knex = require('../bookshelf');
const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', {session: false});
const jsonParser = bodyParser.json();

router.get('/', (req, res, next) => {
	const username  = req.user ? req.user : 'guest';
	const message = `GET request from "${username}"`;
	console.log(message);
	knex('stories')
		.select()
		.limit(15)
		.then(result => {
			if(!result) {
				console.log('oh no, there was an error');
			}
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
});

router.post('/', [jwtAuth, jsonParser], (req, res, next) => {
	const username = req.user;
	const { story } = req.body;
	const message = `POST request from "${username}"`;
	console.log(message);
	res.json(message);
});

router.put('/:id', [jwtAuth, jsonParser], (req, res, next) => {
	const username = req.user;
	const { story } = req.body;
	const message = `PUT request from "${username}"`;
	console.log(message);
	res.json(message);
});

module.exports = router;