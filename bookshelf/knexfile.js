require('dotenv').config({path:'../.env'});
module.exports = {
	development: {
		client: 'pg',
		connection: process.env.DATABASE_URL_PG || 'postgres://localhost/story-time-app',
		debug: false, // http://knexjs.org/#Installation-debug
		pool: { min: 3, max: 5 }
	},
	test: {
		client: 'pg',
		connection: process.env.TEST_DATABASE_URL_PG || 'postgres://localhost/story-time-app-test',
		debug: false,
		pool: {min : 1 , max : 2}
	},
	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL_PG
	}
};