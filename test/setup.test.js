const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../bookshelf');

const {seed} = require('../bookshelf/seed/seed-database');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Reality Check', () => {
	it('true should be true', () => {
		expect(true).to.be.true;
	});
});

describe('Environment', () => {
	it('NODE_ENV should be "test"', () => {
		expect(process.env.NODE_ENV).to.equal('test');
	});

	it('connection should be test database', () => {
		expect(knex.client.connectionSettings.database).to.equal('fqvudtjd'); // The "remote" test database
	});
});

describe('Testing Seed', () => {
	const USER_TOTAL = 1;
	const STORY_TOTAL = 1;
	it('should seed data', () => {
		return seed(USER_TOTAL, STORY_TOTAL)
			.then(() => {
				const users = knex('users');
				const stories = knex('stories');
				return Promise.all([users,stories]);
			})
			.then(([user, story]) => {
				expect(user).to.have.length(1);
				expect(story).to.have.length(1);
			});
	});
});

describe('Basic Express setup', () => {
	describe('404 handler', () => {
		it('should respond with 404 when given a bad path', () => {
			return chai.request(app)
				.get('/bad/path')
				.catch(err => err.response)
				.then(res => {
					expect(res).to.have.status(404);
				});
		});
	});
});