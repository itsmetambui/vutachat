module.exports = function(app) {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  const joinChannels = (user, connection) => {
    app.channel('anonymous').leave(connection);
    app.channel('authenticated').join(connection);
    // Assuming that the chat room/user assignment is stored
    // on an array of the user
    user.rooms.forEach(roomId =>
      app.channel(`rooms/${roomId}`).join(connection)
    );
  };

  const leaveChannels = user => {
    
    app.channel(app.channels).leave(connection => {
      if(connection.user) connection.user._id.equals(user._id);
    });
  };

  const updateChannels = user => {
    // Find all connections for this user
    const { connections } = app.channel(app.channels).filter(connection => {
      if(connection.user) {
        return connection.user._id.equals(user._id);
      }
    });
  
    // Leave all channels
    leaveChannels(user);
  
    // Re-join all channels with the updated user information
    connections.forEach(connection => joinChannels(user, connection));
  };

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult, { connection }) => {
    joinChannels(connection.user, connection);
  });

  // eslint-disable-next-line no-unused-vars
  app.publish((data, hook) => {
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    // console.log('Publishing all events to all authenticated users. See `channels.js` and https://docs.feathersjs.com/api/channels.html for more information.'); // eslint-disable-line

    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated');
  });

  app.service('users').on('updated', updateChannels);
  app.service('users').on('patched', updateChannels);
  // On `removed`, remove the connection from all channels
  app.service('users').on('removed', leaveChannels);


  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));
  app.service('messages').publish((data) => {
    return app.channel(`rooms/${data.roomId}`);
  });
  
  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });
};
