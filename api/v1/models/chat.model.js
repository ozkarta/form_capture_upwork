let mongoose = require('mongoose');

let chatSchema = new mongoose.Schema({
    users: [
        {
            type: {type: String, enum: ['regular', 'temporary']},
            user: {type: mongoose.Schema.Types.ObjectId}
        }
    ],
    messages: [
        {
            sender: {
                type: {type: String, enum: ['regular', 'temporary']},
                user: {type: mongoose.Schema.Types.ObjectId}
            },
            text: {type: String}
        }
    ]

}, {
    timestamps: true
});

let chatModel = mongoose.model('Chat', chatSchema);

exports.model = chatModel;
exports.schema = chatSchema;