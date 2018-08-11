const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../bookshelf');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { hashPassword } = require('../bookshelf/utils');

const {seed, dropTables} = require('../bookshelf/seed/seed-database');

const expect = chai.expect;
chai.use(chaiHttp);


describe('END-POINT /api/auth', () => {
	const USER_TOTAL = 1;

	beforeEach(() => {
		return seed(USER_TOTAL);
	});

	afterEach(() => {
		return dropTables();
	});

	describe('POST /api/auth/login', () => {
		const user = {username:'usernametest', password:'passwordtest'};
		beforeEach(() => {
			return hashPassword(user.password)
				.then(hash => {
					const toStore = {username: user.username, password: hash};
					return knex('users')
						.insert(toStore);
				});
		});
		it('should return a json web token when given valid user credentials', () => {
			return chai.request(app)
				.post('/api/auth/login')
				.send(user)
				.then(res => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.key('authToken');
				});
		});

		it('should return correct error messages on invalid request', () => {
			const invalidUsername = {username:'notinhereattall', password:'passwordtest'};
			const invalidPassword = {username:'usernametest', password:'wrongpassword'};

			const resUsername = chai.request(app)
				.post('/api/auth/login')
				.send(invalidUsername);

			const resPassword = chai.request(app)
				.post('/api/auth/login')
				.send(invalidPassword);

			return Promise.all([resUsername, resPassword])
				.then(([username,password]) => {
					expect(username).to.have.status(401);
					expect(username.body.message).to.equal('Not a valid username');
					expect(password).to.have.status(401);
					expect(password.body.message).to.equal('Not a valid password');
				});

		});
	});


	describe('POST /api/auth/refresh', () => {
		const user = {username:'usernametest', password:'passwordtest'};
		let token;
		beforeEach(() => {
			return hashPassword(user.password)
				.then(hash => {
					const toStore = {username: user.username, password: hash};
					return knex('users')
						.insert(toStore);
				})
				.then(() => {
					return knex('users')
						.select()
						.where({username: user.username})
						.returning(['id', 'username','firstname','lastname', 'created_at', 'updated_at']);
				})
				.then(data => {
					const toSign = data[0];
					return jwt.sign({toSign}, config.JWT_SECRET, {
						subject: user.username,
						expiresIn: config.JWT_EXPIRY,
						algorithm: 'HS256'
					});
				})
				.then(authToken => {
					token = authToken;
				});
		});

		it.only('should return a json web token when given valid user credentials', () => {
			return chai.request(app)
				.post('/api/auth/refresh')
				.send(user)
				.set('Authorization', `Bearer ${token}`)
				.then(res => {
					// expect(res).to.have.status(200);
					// expect(res.body).to.have.key('authToken');
				});
		});

		it('should return correct error messages on invalid request', () => {
			const invalidUsername = {username:'notinhereattall', password:'passwordtest'};
			const invalidPassword = {username:'usernametest', password:'wrongpassword'};

			const resUsername = chai.request(app)
				.post('/api/auth/refresh')
				.send(invalidUsername)
				.set('Authorization', `Bearer ${token}`);

			const resPassword = chai.request(app)
				.post('/api/auth/refresh')
				.send(invalidPassword)
				.set('Authorization', `Bearer ${token}`);

			return Promise.all([resUsername, resPassword])
				.then(([username,password]) => {
					console.log(username.body, username.status);
					console.log(password.body, password.status);
					// expect(username).to.have.status(401);
					// expect(username.body.message).to.equal('Not a valid username');
					// expect(password).to.have.status(401);
					// expect(password.body.message).to.equal('Not a valid password');
				});
		});
	});
});