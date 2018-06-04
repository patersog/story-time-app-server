const { Strategy: LocalStrategy } = require('passport-local');

const knex = require('../bookshelf');
const { validatePassword } = require('../bookshelf/utils');

//TODO: Implement this from memory
const localStrategy = new LocalStrategy((username, password, done) => {
	let user;
	knex('users')
		.where({'username': username})
		.then(result => {
			user = result[0];
			console.log(user);
			if(!user) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Not a valid username',
					location: 'username'
				});
			}
			return validatePassword(password, user.password);
		})
		.then( valid => {
			if(!valid) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Not a valid password',
					location: 'password'
				});
			}
			return done(null, user);
		})
		.catch(err => {
			if(err.reason === 'LoginError') {
				err.status = 401;
				return done(err);
			}
			return done(err);
		});
});

module.exports = localStrategy;