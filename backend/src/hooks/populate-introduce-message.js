// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks, see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { app, result } = context;

    const master = await app.service('master-user').find();
    const roomId = result.rooms[0];

    let now = new Date().getTime();
    const messages = introduceMessages.map(text => {
      now += 500;
      return {
        text,
        roomId,
        userId: master._id,
        createdAt: now
      };
    });

    try {
      app.service('messages').create(messages);
    } catch(e) {
      throw e;
    }

    return context;
  };
};

const introduceMessages = [
  'Hi, my name\'s Tam',
  'I\'m a web developer with 3 years\' experience in web development',
  'In 2016, I got my first job as a junior frontend developer at TMA Solutions in HCM, Vietnam. I had the chance working with highly experienced partners like Nokia, building large Single Page Applications for networking.',
  'While woking at TMA Solution, I was also exposed to backend development with dockerization and continous delivery.',
  'Two years later I moved to Can Tho and started to work for Axon Active Vietnam. Here, as a multipnational team, we applied Agile development through Scrum framework, develop and deploy Fintech applications for Swiss partners.'
];