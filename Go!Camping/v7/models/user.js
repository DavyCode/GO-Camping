var mongoose = require('mongoose'),
    passportlocalMongoose = require('passport-local-mongoose');



var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
UserSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model('User', UserSchema);