var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    followers: [{ type: Schema.ObjectId, ref: 'User' }],
    following: [{ type: Schema.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', schema);