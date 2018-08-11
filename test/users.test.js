const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const {seed, dropTables} = require('../bookshelf/seed/seed-database');

const expect = chai.expect;
chai.use(chaiHttp);

describe('END-POINT /users', () => {
	/** Configure amounts */
	const USER_TOTAL = 1;

	describe('POST /api/users', () => {

		const testUser = {
			username: 'testuser123',
			password: 'testpassword123',
			firstName: 'test',
			lastName: 'test'
		};

		beforeEach(() => {
			return seed(USER_TOTAL);
		});

		afterEach(() => {
			return dropTables();
		});

		it('should create a user with valid request body', () => {

			return chai.request(app)
				.post('/api/users')
				.send(testUser)
				.then(res => {
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					expect(res.body.username).to.equal(testUser.username);
					expect(res.body.firstname).to.equal(testUser.firstName);
					expect(res.body.lastname).to.equal(testUser.lastName);
				});
		});

		it('should prevent duplicate users from being created', () => {
			return chai.request(app)
				.post('/api/users')
				.send(testUser)
				.then(() => {
					return chai.request(app)
						.post('/api/users')
						.send(testUser);
				})
				.then(res => {
					expect(res).to.have.status(422);
					expect(res).to.be.json;
					expect(res.body.message).to.equal('Username already taken');
					expect(res.body.location).to.equal('username');
				});
		});

		it('should return the correct error messages with invalid request body', () => {
			const noUsername = {
				password: 'nousername',
				firstName: 'test',
				lastName: 'test'
			};
			const noPassword = {
				username: 'nopassword',
				firstName: 'test',
				lastName: 'test'
			};
			const notString1 = {
				username: 1234567890,
				password: 'nousername',
				firstName: 'test',
				lastName: 'test'
			};
			const notString2 = {
				username: 'notastring',
				password: 1234567890,
				firstName: 'test',
				lastName: 'test'
			};

			const notTrimmed = {
				username: ' notastring ',
				password: 'password',
				firstName:'not',
				lastName: 'trimmed'
			};

			const notSized = {
				username: 'mypasswordistoshort',
				password: 'tooshort',
				firstName:'not',
				lastName: 'sized'
			};

			const resNoUsername = chai.request(app)
				.post('/api/users')
				.send(noUsername);

			const resNoPassword = chai.request(app)
				.post('/api/users')
				.send(noPassword);

			const resNotString1 = chai.request(app)
				.post('/api/users')
				.send(notString1);

			const resNotString2 = chai.request(app)
				.post('/api/users')
				.send(notString2);

			const resNotTrimmed = chai.request(app)
				.post('/api/users')
				.send(notTrimmed);

			const resNotSized = chai.request(app)
				.post('/api/users')
				.send(notSized);

			return Promise.all([
				resNoUsername,
				resNoPassword,
				resNotString1,
				resNotString2,
				resNotTrimmed,
				resNotSized,
			])
				.then(([username,password, string1,string2,trim,size]) => {

					expect(username).to.have.status(422);
					expect(username.body.message).to.equal('Missing field');
					expect(username.body.location).to.equal('username');

					expect(password).to.have.status(422);
					expect(password.body.message).to.equal('Missing field');
					expect(password.body.location).to.equal('password');

					expect(string1).to.have.status(422);
					expect(string1.body.message).to.equal('Incorrect field type: expected string');
					expect(string1.body.location).to.equal('username');

					expect(string2).to.have.status(422);
					expect(string2.body.message).to.equal('Incorrect field type: expected string');
					expect(string2.body.location).to.equal('password');

					expect(trim).to.have.status(422);
					expect(trim.body.message).to.equal('Cannot start or end with whitespace');
					expect(trim.body.location).to.equal('username');

					expect(size).to.have.status(422);
					expect(size.body.message).to.equal('Must be at least 10 characters long');
					expect(size.body.location).to.equal('password');

				});
		});
	});
});