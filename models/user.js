//jshint esversion:6

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type: String
  },
  username:{
    type: String
  },
  email:{
    type: String
  },
  password:{
    type: String
  },
  contacts:[{
    name:{
      type:String,
    },
    email:{
      type:String
    },
    contactId:{
      type:String
    },
  }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
