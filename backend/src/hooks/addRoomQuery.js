// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks, see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // Get `app`, `method`, `params` and `result` from the hook context
    const { params } = context;

    if(!params.query.roomId) {
      params.query.roomId = params.user.rooms[0];
    }

    // Best practice: hooks should always return the context
    return context;
  };
};