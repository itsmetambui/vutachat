// messages-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const messages = new Schema({
    text: { type: String, required: true },
    name: { type: String, requrired: true},
    userId: { type: String , required: true },
    roomId: { type: String , required: true },
  }, {
    timestamps: true
  });

  return mongooseClient.model('messages', messages);
};
