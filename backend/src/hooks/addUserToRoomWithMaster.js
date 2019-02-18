// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks, see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { app, data } = context;
    const master = await app.service('master-user').find();
    
    if(data.email == master.email) {
      context.data.rooms = [];
      return context;
    }

    const roomId = `${data.email}|${master.email}`;
    context.data.rooms = [roomId];
    app.service('master-user').addToRoom(roomId);

    // Best practice: hooks should always return the context
    return context;
  };
};