let mongoose = require('mongoose');

let chatMessageSchema = new mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: {type: String},
  attachments: [],
  seen: [{
    by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    time: {type: Date, default: Date.now}
  }]
}, {
  timestamps: true
});

let chatMessageModel = mongoose.model('ChatMessage', chatMessageSchema);
exports.schema = chatMessageSchema;
exports.model = chatMessageModel;