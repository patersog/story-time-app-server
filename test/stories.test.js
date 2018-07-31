
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const knex = require('../bookshelf');

const seedData = require('../bookshelf/seed/seed-database');
//const dropDatabase = require('../bookshelf/seed/drop-tables');

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

describe('Storytime API', () => {
	/** Configure amounts */
	const USER_TOTAL = 30;
	const STORY_TOTAL = 50;

	beforeEach(() => {
		return seedData(USER_TOTAL, STORY_TOTAL);
	});

	after(() => {
		return knex.destroy();
	});

	// describe('GET /api/stories', () => {
	// 	it('should return the stories', () => {
	// 		let count;
	// 		return knex('stories')
	// 			.count()
	// 			.then(([result]) => {
	// 				count = Number(result.count);
	// 				return chai.request(app).get('/api/stories');
	// 			})
	// 			.then(res => {
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.json;
	// 				expect(res.body).to.be.a('array');
	// 				expect(res.body).to.have.length(count);
	// 			});
	// 	});

	// 	it('should return a list with the correct fields', function () {
	// 		return chai.request(app)
	// 			.get('/api/stories')
	// 			.then(function (res) {
	// 				expect(res).to.have.status(200);
	// 				expect(res).to.be.json;
	// 				expect(res.body).to.be.a('array');
	// 				res.body.forEach(function (item) {
	// 					expect(item).to.be.a('object');
	// 					expect(item).to.include.keys('id', 'uid', 'title', 'text', 'created_at', 'updated_at');
	// 				});
	// 			});
	// 	});
	// });

	describe('GET /api/stories/:id', () => {
		it('should return the correct story', () => {
			let data,api;

			return knex('stories')
				.first()
				.then(res => {
					console.log(res);
				});

			// const apiPromise = chai.request(app)
			// 	.get('/api/stories/1000');

			// return Promise.all([dataPromise, apiPromise])
			// 	.then(function ([data, res]) {
			// 		expect(res).to.have.status(200);
			// 		expect(res).to.be.json;
			// 		expect(res.body).to.be.an('object');
			// 		expect(res.body).to.include.keys('id', 'title', 'content');
			// 		expect(res.body.id).to.equal(1000);
			// 		expect(res.body.title).to.equal(data.title);
			// 	});
		});

		it('should respond with a 404 for an invalid id', function () {
			return chai
				.request(app)
				.get('/DOES/NOT/EXIST')
				.then(res => {
					expect(res).to.have.status(404);
				});
		});
	});
});
