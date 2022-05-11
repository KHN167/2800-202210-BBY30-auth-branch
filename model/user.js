"use strict";
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String},
    lastname: { type: String},
    password: { type: String}
}) ;


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);