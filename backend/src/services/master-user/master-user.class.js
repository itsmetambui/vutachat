/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.masterUser = null;
  }

  async setup(app) {
    this.app = app;

    if(!this.masterUser) {
      const { email, password } = this.app.get('master');
      const result = await this.app.service('users').find({query: { email }});
      
      if(result.total != 0) {
        this.masterUser = result.data[0];
      } else {
        this.masterUser = await this.app.service('users').create({email, password});
      }
    }
  }

  async find () {
    return this.masterUser;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
