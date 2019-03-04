const { authenticate } = require('@feathersjs/authentication').hooks;

const processMessage = require('../../hooks/process-message');

const populateUser = require('../../hooks/populate-user');
const addRoomQuery = require('../../hooks/add-room-query');
const notifyToSlack = require('../../hooks/notify-to-slack');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [addRoomQuery()],
    get: [],
    create: [processMessage(), notifyToSlack('message-created')],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populateUser()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
