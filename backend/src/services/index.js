const messages = require('./messages/messages.service.js');
const users = require('./users/users.service.js');
const masterUser = require('./master-user/master-user.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(messages);
  app.configure(users);
  app.configure(masterUser);
};
