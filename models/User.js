const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, enum: [true,false], default: false }
});

const Users = mongoose.model('User', Schema);

module.exports = Users;
