/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.masterUser = null;
  }

  setup(app) {
    this.app = app;
  }

  async get (email, password) {
    if(!this.masterUser) {
      const masterUser = await this.app.service('users').find({query: { email }});
      if(masterUser) {
        this.masterUser = masterUser[0];
      } else {
        this.masterUser = await this.app.service('users').create({email, password});
      }
    }
    return this.master;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
