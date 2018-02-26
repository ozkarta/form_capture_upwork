let mongoose = require('mongoose');

let chatSchema = new mongoose.Schema({
  participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage'}]
}, {
  timestamps: true
});

let chatModel = mongoose.model('Chat', chatSchema);

exports.model = chatModel;
exports.schema = chatSchema;