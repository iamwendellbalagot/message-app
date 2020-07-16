//jshint esversion:6

const mongoose  = require('mongoose');

const contactSchema = new mongoose.Schema({
  senderId:{
    type: String
  },

  recieverId:{
    type: String
  },

  message:{
    type: String
  }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports= Contact;
