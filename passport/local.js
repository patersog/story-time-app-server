const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models/user');

const bookshelf = require('../bookshelf');

// TODO: Implement this from memory
// const localStrategy = new LocalStrategy((username, password, done) => {
// 	let user;
// 	User.findOne({ username })
// 		.then(result => {
// 			user = result;
// 			if(!user){
// 				return Promise.reject({
// 					reason: 'LoginError',
// 					message: 'Not a valid username',
// 					location: 'username'
// 				});
// 			}
// 			return user.validatePassword(password);
// 		})
// 		.then(isValid => {
// 			if(!isValid) {
// 				return Promise.reject({
// 					reason: 'LoginError',
// 					message: 'Not a valid password',
// 					location: 'password'
// 				});
// 			}
// 			return done(null, user);
// 		})
// 		.catch(err => {
// 			if (err.reason === 'LoginError') {
// 				err.status = 401;
// 				return done(err);
// 			}
// 			return done(err);
// 		});
// });

// module.exports = localStrategy;