const knexConfig = require('./knexfile');

console.log(process.env.NODE_ENV);

const environment = process.env.NODE_ENV || 'development';

module.exports = require('knex')(knexConfig[environment]);

// TODO: Utilize bookshelf?
// const knex = require('knex')(knexConfig[environment]);
// module.exports = require('bookshelf')(knex);