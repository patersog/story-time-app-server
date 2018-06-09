
const knex = require('../bookshelf');


knex.schema.dropTableIfExists('stories')
	.then(() => {
		//Drop users Table
		return knex.schema.dropTableIfExists('users');
	});