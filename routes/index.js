
const router = require('express').Router();

// const passport = require('passport');
// const localStrategy = require('../passport/local');
// const jwtStrategy = require('../passport/jwt');

const authRouter = require('./auth');
const storiesRouter = require('./stories');
const userRouter = require('./user');

// passport.use(localStrategy);
// passport.use(jwtStrategy);

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/stories', storiesRouter);

//Use as the root router for application server
module.exports = router;