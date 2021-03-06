# Storytime

## Motivation

Story time is a platform for writers who want to foster their confidence and skills in writing, by sharing their works with a community passionate about story telling.

As a visitor of our site, we want to provide the best possible user experience for you. That being said, there are a couple of rules to abide by when engaging with the community.

## Tech Stack

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

On the [Client](https://github.com/patersog/story-time-app-client)

[React](https://reactjs.org/)

[Redux](https://redux.js.org/)

[ReduxForm](https://redux-form.com/7.3.0/)

On the [Server](https://github.com/patersog/story-time-app-server)

[Node.js](https://nodejs.org/)

[Express.js](https://expressjs.com/)

[Knex.js](https://knexjs.org/) configured with [PostgreSQL](https://www.postgresql.org/), hosted by [elephantsql](https://www.elephantsql.com/)

[passport.js](http://www.passportjs.org/)

[bcrypt.js](https://github.com/dcodeIO/bcrypt.js)

[jsonwebtokens](https://github.com/auth0/node-jsonwebtoken)

Corresponding package.json files provide more detail

## Code

### Client

All React components live in the /src/components directory, and their corresponding styles in the src/components/styles. Actions and reducers for redux
are in /src/ as well.

All tests are contained in /__tests__ directories for their corresponding test usage (i.e the /__tests__ folder in /components
contains the tests for the components)

#### Server

Entry point for the application is server.js, and configuration in config.js
/bookshelf contains the PostgreSQL-knex config files

## Screen Shots

### DashBoard

![dashboard view](https://c1.staticflickr.com/2/1813/42207070020_c72b4a6a29_b.jpg)

### Login

![login view](https://c1.staticflickr.com/2/1777/30147810588_518b1b58c3_b.jpg)

### Story

![story view](https://c1.staticflickr.com/2/1798/42207069790_32d6d41aea_b.jpg)

## Task List

### Completed

- [x] JWT secure login
- [x] All users can view any story
- [x] Authorized users can post and edit stories
- [x] Have the client follow accesibility standards
- [x] Rigourous testing of Client and Server

### Planned

- [ ] Story Pagination
- [ ] User can add comments to a story
- [ ] Filter Stories by genre
- [ ] Text Search by "likeness"

#### Other Tasks

- [ ] Add CDCI

### Deployment

[Storytime](https://confused-texture.surge.sh/)

Deployed with [surge](https://surge.sh/) and [heroku](https://github.com/heroku);