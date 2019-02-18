// Initializes the `master-user` service on path `/master-user`
const createService = require('./master-user.class.js');
const hooks = require('./master-user.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/master-user', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('master-user');

  service.hooks(hooks);
};
