// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks, see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { app, data } = context;
    const masterEmail = app.get('master').email;
    if(data.email == masterEmail) {
      context.data.rooms = [];
    } else {
      const roomId = `${data.email}|${masterEmail}`;
      context.data.rooms = [roomId];
      app.service('master-user').addToRoom(roomId);
    }
    return context;
  };
};