const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const oauth2 = require('@feathersjs/authentication-oauth2');
const GithubStrategy = require('passport-github');

module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  app.configure(oauth2(Object.assign({
    name: 'github',
    Strategy: GithubStrategy
  }, config.github)));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        context => {
          // make sure params.payload exists
          context.params.payload = context.params.payload || {};
          // merge in a `test` property
          Object.assign(context.params.payload, {isAdmin: app.get('master').email === context.params.user.email, email: context.params.user.email});
        }
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
