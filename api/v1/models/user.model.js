let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    firstName: {type: String, trim: true},
    lastName: {type: String, trim: true},
    email: {type: String, trim: true},
    passwordHash: {type: String},
    role: {type: String, enum: ['buyer']},
    searches: [{type: String, trim: true}]
}, {
    timestamps: true
});

let userModel = mongoose.model('User', userSchema);

exports.model = userModel;
exports.schema = userSchema;