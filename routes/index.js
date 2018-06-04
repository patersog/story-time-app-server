
const router = require('express').Router();

const authRouter = require('./auth');
const storiesRouter = require('./stories');
const userRouter = require('./user');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/stories', storiesRouter);

//Use as the root router for application server
module.exports = router;