const knexConfig = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';

console.log('postgres database', process.env.DATABASE_URL_PG);

module.exports = require('knex')(knexConfig[environment]);

// TODO: Utilize bookshelf?
// const knex = require('knex')(knexConfig[environment]);
// module.exports = require('bookshelf')(knex);