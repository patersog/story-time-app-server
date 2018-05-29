
const router = require('express').Router();

const { authRouter } = require('./auth');
const { storiesRouter } = require('./stories');
const { userRouter } = require('./user');

//Use as the root router for application server

router.use('/auth', authRouter);
router.use('/stories', storiesRouter);
router.use('/users', userRouter);

module.exports = { router };