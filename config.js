
exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
exports.DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/story-time-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/story-time-app-test';
exports.JWT_SECRET = process.env.JWT_SECRET || 'MAKE_A_SECRET';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
