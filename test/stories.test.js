
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const knex = require('../bookshelf');

const seedData = require('../bookshelf/seed/seed-database');
//const dropDatabase = require('../bookshelf/seed/drop-tables');

const expect = chai.expect;
chai.use(chaiHttp);

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

	describe('GET /api/stories', () => {
		it('should return 20 stories', () => {

			return chai.request(app).get('/api/stories')
				.then(res => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('array');
					expect(res.body).to.have.length(20);
				});
		});

		it('should return a list with the correct fields', function () {
			return chai.request(app)
				.get('/api/stories')
				.then(function (res) {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('array');
					res.body.forEach(function (item) {
						expect(item).to.be.a('object');
						expect(item).to.include.keys('id', 'uid', 'title', 'text', 'created_at', 'updated_at');
					});
				});
		});
	});

	describe('GET /api/stories/:id', () => {
		it('should return the correct story', () => {
			let data;
			return knex('stories')
				.first()
				.then(_data => {
					data = _data;
				})
				.then(() => {
					return chai.request(app)
						.get(`/api/stories/${data.id}`);
				})
				.then(res => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.an('object');
					expect(res.body).to.include.keys('id', 'uid', 'title', 'text', 'updated_at', 'created_at','username');
					expect(res.body.id).to.equal(data.id);
					expect(res.body.uid).to.equal(data.uid);
					expect(res.body.title).to.equal(data.title);
				});
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
