
const router = require('express').Router();
const bodyParser = require('body-parser');
const passport = require('passport');

const knex = require('../bookshelf');

const jwtAuth = passport.authenticate('jwt', {session: false});
const jsonParser = bodyParser.json();

router.get('/', (req, res, next) => {

	/** FOR DEBUGGING
	 * const username  = req.user ? req.user : 'guest';
	 * const message = `GET request from "${username}"`;
	 * console.log(message);
	 */

	//TODO: Add pagination and query selectors
	knex('stories')
		.select('stories.id', 'stories.uid as uid', 'stories.updated_at', 'stories.created_at', 'title','text',
			'users.username as username')
		.leftJoin('users', 'stories.uid', 'users.id')
		.limit(10)
		.orderBy('stories.updated_at')
		// add queryBuilder for selecting genres titles
		.then(results => {
			console.log(results);
			if(!results) {
				console.log('oh no, there was an error');
			}
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});

router.get('/:id', (req, res, next) => {
	const { id } = req.params;

	/** FOR DEBUGGING
	 * const username  = req.user ? req.user : 'guest';
	 * const message = `GET request from "${username}"`;
	 * console.log(message);
	 */

	knex('stories')
		.select('stories.id', 'stories.uid as uid', 'stories.updated_at', 'stories.created_at', 'title','text',
			'users.username as username')
		.where('stories.id', id)
		.leftJoin('users', 'stories.uid', 'users.id')
		.then(result => {
			// console.log('FETCH_STORY', result);
			if(!result) {
				console.log('oh no, there was an error');
			}
			res.json(result[0]);
		})
		.catch(err => {
			next(err);
		});
});

router.post('/', [jwtAuth, jsonParser], (req, res, next) => {

	const {
		//username,
		id
	} = req.user;

	const {
		title,
		text
	} = req.body;

	// TODO: write a dynamic field validator
	if (!title) {
		const err = new Error('Missing `title` in request body');
		err.status = 400;
		return next(err);
	}

	if(!text) {
		const err = new Error('Missing `text` in request body');
		err.status = 400;
		return next(err);
	}

	const newStory = {
		'uid': id,
		'title': title,
		'text': text,
	};

	let storyId;

	/** FOR DEBUGGING
	 * const message = `POST request from ${username} to submit story ${title}`;
	 * console.log(message);
	 */

	knex('stories')
		.insert( newStory, ['id','uid','title','text', 'created_at', 'updated_at'])
		
		.then(result => {
			if(!result) {
				//TODO: Add more descriptive Errors
				console.log('oh no, there was an error');
			}
			return result;
		})
		.then(result => {
			storyId = result.id;
			res.location(`${req.originalUrl}/${storyId}`).status(201).json(result[0]);
		})
		.catch(next);
});

router.put('/:storyId', [jwtAuth, jsonParser], (req, res, next) => {

	const { id } = req.user;
	const { title, text } = req.body;
	const { storyId } = req.params;

	// TODO: write a dynamic field validator
	if (!title) {
		const err = new Error('Missing `title` in request body');
		err.status = 400;
		return next(err);
	}

	if(!text) {
		const err = new Error('Missing `text` in request body');
		err.status = 400;
		return next(err);
	}

	const updateObj = {
		title,
		text,
	};

	/** FOR DEBUGGING
	 * const username = req.user;
	 * const message = `PUT request from "${username}"`;
	 * console.log(message);
	 */

	knex('stories')
	.update(updateObj, ['id','uid','title','text', 'created_at', 'updated_at'])
	.where({'id': storyId, 'uid': id})
	.then(result => {
		if(!result) {
			//TODO: Add more descriptive Errors
			console.log('oh no, there was an error');
		}
		return result;
	})
	.then(result => {
		console.log(result);
		res.location(`${req.originalUrl}/${storyId}`).status(201).json(result[0]);
	})
	.catch(next);

});

module.exports = router;