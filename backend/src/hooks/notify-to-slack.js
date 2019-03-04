const axios = require('axios');

module.exports = function (event, options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // The user email
    const { app, data } = context;

    const slackWebhookUrl = app.get('slackWebhook');
    let text;
    const username = data.roomId ? getUserNameFromRoom(data.roomId) : '';

    if(event === 'user-created') {
      text = `New user created: ${data.email}`;
    } else {
      text = `New message create: From room ${username}: ${data.text}`;
    }
    
    if(username === app.get('master').email) return context;

    axios.post(slackWebhookUrl, {text})
      .then(() => {console.log('Send notification to Slack successfully');})
      .catch((e) => {console.log('Send notification to Slack failed', e);});

    // Best practice: hooks should always return the context
    return context;
  };
};

const getUserNameFromRoom = room => {
  let names = room.split('|');
  if(names.length > 0) return names[0];
};