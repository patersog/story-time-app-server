
const bcrypt = require('bcryptjs');

const validatePassword = function(submitedPassword, dbPassword) {
	return bcrypt.compare(submitedPassword, dbPassword);
};

const hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};

module.exports = { validatePassword, hashPassword };