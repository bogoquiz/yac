const Message = require('./models/Message');

function listMessage(msg,socket) {
	const chat = new Message();
	   chat.nickName = msg.nick;
	   chat.Message = msg.message	
	   chat.save((err, user) => {
        if (err) {
          socket.emit('chat', {'nick':'Servidor', 'message': 'Error en el Chat'})
		  } else {
		    Message.find({ }, (err, mesgs) => {
		      if (err) {
		        socket.emit('chat', {'nick':'Servidor', 'message': 'No disponible'})
		      } else {
		      	console.log(mesgs)
		        socket.emit('chat', mesgs)
		      }   
		 })       
		}    	
      });
}

module.exports.listMessage = (msg,socket) => listMessage(msg,socket)
