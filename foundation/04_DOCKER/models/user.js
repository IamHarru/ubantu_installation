const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydatabase')
const userSchema = mongoose.Schema({
    name: String,
    gmail: String,
    gender: String,
    image: String

});
module.exports = mongoose.model('User', userSchema)