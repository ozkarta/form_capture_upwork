let mongoose = require('mongoose');

module.exports = exports = function chatPlugin(schema) {
  schema.add({
    wsSessionId: {type: String},
    chats: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}]
  });
};