let mongoose = require('mongoose');

let tempUserSchema = new mongoose.Schema({
    name: {type: String, trim: true},
    phone: {type: String, trim: true},
    token: {type: String, trim: true},
    deletedFlag: {type: Boolean, default: false}
}, {
    timestamps: true
});

let tempUserModel = mongoose.model('TempUser', tempUserSchema);

exports.model = tempUserModel;
exports.schema = tempUserSchema;