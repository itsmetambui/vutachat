// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks, see: http://docs.feathersjs.com/api/hooks.html

// The Gravatar image service
const adorableUrl = 'https://api.adorable.io/avatars/';
// The size query. Our chat needs 60px images
const query = '60';

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // The user email
    const { email } = context.data;

    context.data.avatar = `${adorableUrl}/${query}/${email}.png`;

    // Best practice: hooks should always return the context
    return context;
  };
};