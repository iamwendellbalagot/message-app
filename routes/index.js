//jshint esversion:6

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();

//socketio


//including auth.js
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../configs/auth');

//including user schema (user.js)
const User = require('../models/User');
const Contact = require('../models/Contact');

//GET request
router.get('/', forwardAuthenticated, function(req, res){
  res.render('homepage');
});

router.get('/contacts', ensureAuthenticated, function(req,res){
  const contacts = req.user.contacts;
  res.render('contacts', {name: req.user.name, contacts:contacts});
});

router.get('/search', ensureAuthenticated, function(req, res){
  res.render('search');
});

router.get('/message/:id',ensureAuthenticated, function(req, res){
  const id = req.params.id;
  var io = req.app.get('socketio');

  io.on('connection', function(socket){
    //get the meesage from mongoDB
    Contact.find({senderId:req.user._id}, function(err, user){
      user.map(function(data){
        const recieverId = data.recieverId;
        if (recieverId === id) {
          let messages = [data.message];
          console.log(messages);
          socket.emit('output', messages);
          console.log('Message emmitted to output');
        }else {
          console.log('No messages');
        }

      });
    });

    socket.on('input', function(data){
      let message = data.message;
      if (message === '') {
        console.log('Empty message');
      }else {
         const newMessage = new Contact({
           senderId: req.user._id,
           recieverId:id,
           message: message
         });

         newMessage.save();


        //User.find({_id:id}, function(err, user){
        //  user.map(function(data){
        //    const userID = req.user._id;
        //    const dataUser = data.contacts;
        //    let obj = dataUser.find(o => o.contactId === userID.toString());
        //    messages = obj.message;
        //    messages.push(message);
        //    console.log(message);
        //    console.log('sent a message');
        //  });
        //});
      }
    });
  });
  res.render('message');
});

//POST request
router.post('/search', function(req, res){
  const name = req.body.name;
  User.find({name:name}, function(err, user){
    const userName = user.map(n => n.name);
    const id = user.map(n => n._id);
    const nameString = userName.toString();
    res.render('results', {uname: nameString, id:id.toString()});
  });
});

router.post('/adduser', function(req, res){
  userid = req.body.add;
  User.find({_id:userid}, function(err, user){
    const name = user.map(n => n.name);
    const email = user.map(e => e.email);

    const userNow = req.user;

    const addContact = {
      name:name.toString(),
      email:email.toString(),
      contactId:userid
    };

    const addContact1 = {
      name:userNow.name,
      email:userNow.email,
      contactId:userNow._id
    };
    User.update({_id:req.user._id}, {$push:{contacts:addContact}}, function(err){
      console.log('Added to contacts');
      return res.redirect("/contacts");
    });
    User.update({_id:userid}, {$push:{contacts:addContact1}}, function(err){
      console.log('Added Successfully.');
    });
  });
});
module.exports = router;
