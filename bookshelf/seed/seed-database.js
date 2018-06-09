
const knex = require('../');
const faker = require('faker');
// const { hashPassword } = require('../bookshelf/utils');

// const USER_TOTAL = 30;
// const STORY_TOTAL = 50;

// password for testing: 'password10'
// hash of password for testing: '$2a$10$tZ.k8k41b9OjHDN.U/DHWuz7OUjPW8sX0zGytKzndhaIl/rJQMihe'

//Drop stories Table

//console.log(knex);

module.exports = function(USER_TOTAL, STORY_TOTAL) {

	return knex.schema.dropTableIfExists('stories')
		.then(() => {
			//Drop users Table
			return knex.schema.dropTableIfExists('users');
		})
		.then(() => {
			//Create users Table
			return knex.schema.createTable('users', (t) => {
				t.increments('id').primary().notNullable();
				t.string('username').unique().notNullable();
				t.string('password').notNullable();
				t.string('firstname');
				t.string('lastname');
				t.timestamp('created_at').defaultTo(knex.fn.now());
				t.timestamp('updated_at').defaultTo(knex.fn.now());
			});
		})
		.then(() => {
			//Seed users table
			const userPromises = [];
			for(let i = 0; i < USER_TOTAL; i++) {
				userPromises.push({
					username: faker.internet.userName(),
					firstname: faker.name.firstName(),
					lastname: faker.name.lastName(),
					//Hashed password for testing
					password: '$2a$10$tZ.k8k41b9OjHDN.U/DHWuz7OUjPW8sX0zGytKzndhaIl/rJQMihe',
					created_at: faker.date.recent(),
					updated_at: faker.date.future()
				});
			}
			return Promise.all(userPromises);
		})
		.then(usersData => {
			return knex('users').insert(usersData);
		})
		//Create stories table
		.then(() => {
			return knex.schema.createTable('stories', (t) => {
				t.increments('id').primary().notNullable();
				t.integer('uid').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').index();
				t.string('title').notNullable();
				t.text('text','mediumText').notNullable();
				t.timestamp('created_at').defaultTo(knex.fn.now());
				t.timestamp('updated_at').defaultTo(knex.fn.now());
			})
				.then(() => {
					//Seed stories table
					const storyPromises = [];
					for(let i = 0; i < STORY_TOTAL; i++) {
						storyPromises.push({
							title: faker.lorem.words(Math.floor(Math.random() * (5 - 1)) + 1),
							// Since we start from 1 with our user 'id' randomly generate uid reference between 1 and 21;
							uid: Math.floor(Math.random() * (USER_TOTAL - 1)) + 1,
							text: faker.lorem.paragraphs(Math.floor(Math.random() * (15 - 5)) + 5),
							created_at: faker.date.recent(),
							updated_at: faker.date.future()
						});
					}
					return Promise.all(storyPromises);
				})
				.then(storyData => {
					return knex('stories').insert(storyData);
				});
		});
};
