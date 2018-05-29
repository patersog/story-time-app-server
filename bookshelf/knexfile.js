module.exports = {
	development: {
		client: 'pg',
		connection: process.env.DATABASE_URL_PG || 'postgres://localhost/story-time-app',
		debug: true, // http://knexjs.org/#Installation-debug
		pool: { min: 1, max: 2 }
	},
	test: {
		client: 'pg',
		connection: process.env.TEST_DATABASE_URL_PG || 'postgres://localhost/story-time-test',
		pool: {min : 1 , max : 2}
	},
	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL_PG
	}
};