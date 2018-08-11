
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../bookshelf');
const jwt = require('jsonwebtoken');
const config = require('../config');

const { seed, dropTables } = require('../bookshelf/seed/seed-database');
const { hashPassword } = require('../bookshelf/utils');
//const dropDatabase = require('../bookshelf/seed/drop-tables');

const expect = chai.expect;
chai.use(chaiHttp);

describe('END-POINT /stories', () => {
	/** Configure amounts */
	const USER_TOTAL = 30;
	const STORY_TOTAL = 50;

	beforeEach(() => {
		return seed(USER_TOTAL, STORY_TOTAL);
	});

	afterEach(() => {
		return dropTables();
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

		it('should respond with the correct error message with non-existent id', () => {
			return chai.request(app)
				.get('/api/stories/123456')
				.then(res => {
					expect(res).to.have.status(404);
					expect(res.body.message).to.equal('Not Found');
				});
		});

		it('should respond with the correct error message with a bad url', () => {
			return chai.request(app)
				.get('/api/stories/bad_url')
				.then(res => {
					expect(res).to.have.status(400);
					expect(res.body.message).to.equal('Bad Request');
				});
		});
	});

	describe('PROTECTED END POINTS', () => {
		let user;
		let token;
		beforeEach(() => {
			return hashPassword('testpassword')
				.then(hash => {
					return knex('users')
						.insert({
							username: 'testuser10',
							password: hash,
							firstname: 'firstname',
							lastname: 'lastname'
						});
				})
				.then(() => {
					return knex('users')
						.select()
						.where({username: 'testuser10'})
						.returning(['id', 'username','firstname','lastname', 'created_at', 'updated_at']);
				})
				.then(data => {
					user = data[0];
					return jwt.sign({user}, config.JWT_SECRET, {
						subject: user.username,
						expiresIn: config.JWT_EXPIRY,
						algorithm: 'HS256'
					});
				})
				.then(authToken => {
					token = authToken;
				});
		});

		afterEach(() => {
			return knex('users')
				.where({'username': 'testuser10'})
				.del();
		});

		describe('POST /api/stories' , () => {
			it('should create one story given the correct request body', () => {
				const newStory = {title: 'Test321', text: 'Test123'};
				return chai.request(app)
					.post('/api/stories')
					.send(newStory)
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(201);
						expect(res).to.be.json;
						expect(res.body.uid).to.equal(user.id);
						expect(res.body.title).to.equal(newStory.title);
						expect(res.body.text).to.equal(newStory.text);
					});
			});

			it('should respond with the correct error messages', () => {
				const badOne = {title: 'Test123'};
				const badTwo = {text: 'Test321'};

				const missingText = chai.request(app)
					.post('/api/stories')
					.send(badOne)
					.set('Authorization', `Bearer ${token}`);

				const missingTitle = chai.request(app)
					.post('/api/stories')
					.send(badTwo)
					.set('Authorization', `Bearer ${token}`);

				return Promise.all([missingText, missingTitle])
					.then(([resText, resTitle]) => {
						expect(resText).to.have.status(400);
						expect(resText.body.message).to.equal('Missing `text` in request body');
						expect(resTitle).to.have.status(400);
						expect(resTitle.body.message).to.equal('Missing `title` in request body');
					});
			});
		});

		describe('PUT /api/stories/:id' , () => {
			let toUpdateId;
			beforeEach(() => {
				const testStory = {title: 'Test321', text: 'Test123'};
				testStory['uid'] = user.id;
				return knex('stories')
					.insert(testStory,['id'])
					.then(res => {
						toUpdateId = res[0].id;
					});
			});

			it('should update one story given the correct request body and an existing story id', () => {
				const updates = {text:'update123', title:'update321'};
				return chai.request(app)
					.put(`/api/stories/${toUpdateId}`)
					.send(updates)
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(201);
						expect(res).to.be.json;
						expect(res.header.location).to.equal(`/api/stories/${toUpdateId}`);
						expect(res.body.uid).to.equal(user.id);
						expect(res.body.title).to.equal(updates.title);
						expect(res.body.text).to.equal(updates.text);
					});

			});

			it('should respond with the correct error messages without body parameters', () => {
				const badOne = {title: 'Test123'};
				const badTwo = {text: 'Test321'};

				const missingText = chai.request(app)
					.put(`/api/stories/${toUpdateId}`)
					.send(badOne)
					.set('Authorization', `Bearer ${token}`);

				const missingTitle = chai.request(app)
					.put(`/api/stories/${toUpdateId}`)
					.send(badTwo)
					.set('Authorization', `Bearer ${token}`);

				return Promise.all([missingText, missingTitle])
					.then(([resText, resTitle]) => {
						expect(resText).to.have.status(400);
						expect(resText.body.message).to.equal('Missing `text` in request body');
						expect(resTitle).to.have.status(400);
						expect(resTitle.body.message).to.equal('Missing `title` in request body');
					});
			});

			it('should respond with the correct error message with non-existent id', () => {
				const updates = {text:'update123', title:'update321'};
				return chai.request(app)
					.put('/api/stories/123456')
					.send(updates)
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(404);
						expect(res.body.message).to.equal('Not Found');
					});
			});

			it('should respond with the correct error message with a bad url', () => {
				const updates = {text:'update123', title:'update321'};
				return chai.request(app)
					.put('/api/stories/bad_url')
					.send(updates)
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(400);
						expect(res.body.message).to.equal('Bad Request');
					});
			});
		});

		describe('DELETE /api/stories/:id', () => {
			let toDeleteId;
			beforeEach(() => {
				const story = {title: 'Test321', text: 'Test123'};
				story['uid'] = user.id;
				return knex('stories')
					.insert(story,['id'])
					.then(res => {
						toDeleteId = res[0].id;
					});
			});

			it('should delete the correct story given an existing id', () => {
				return chai.request(app)
					.delete(`/api/stories/${toDeleteId}`)
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(204);
						expect(res.header.location).to.equal(`/api/stories/${toDeleteId}`);
					});
			});

			it('should respond with the correct error message with non-existent id', () => {
				return chai.request(app)
					.delete('/api/stories/123456')
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(404);
						expect(res.body.message).to.equal('Not Found');
					});
			});

			it('should respond with the correct error message with a bad url', () => {
				return chai.request(app)
					.delete('/api/stories/bad_url')
					.set('Authorization', `Bearer ${token}`)
					.then(res => {
						expect(res).to.have.status(400);
						expect(res.body.message).to.equal('Bad Request');
					});
			});
		});
	});
});
