const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    accessToken: String,
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);