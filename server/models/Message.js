const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({ 
  nickName: {
    type: String,
    default: ''
  },
  Message: {
    type: String,
    default: ''
  },
});

module.exports = mongoose.model('Message', MessageSchema);