/* eslint-disable */

module.exports = function (options = {}) {
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
  `My name is Tam.`,
  `I'm a Javascript Fullstack Developer with 3 years of experiences in Web development.
   I speak HTML/CSS, React, Angular, Node and well versed in other libraries like Redux, Feathersjs, and Loopback.
   TDD development, CI/CD and Containerization are also there in my toolbox.`,
  `I love being part of a team, working in an agile environment, together toward a goal.
   I love to take initiative and ownership. I am always thriving for growth as I am an early adopter for new concepts like Suspense, Hooks, react-cache…
   I love to put my new knowledge to use on side projects before applying them for real works.
   You can check out my works at itsmetambui.now.sh .`,
  `If you have a position available, I'd love to hear from you, please shoot me a message :).`
];