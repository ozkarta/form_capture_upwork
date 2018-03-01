let WS_USER_ARRAY = [];

// Mongoose Models
let User = require('../model/user.model').model;
let Chat = require('./ws-models/chat.model').model;
let ChatMessage = require('./ws-models/chat-message.model').model;
let mailer = require('../shared/mailer');
let config = require('../shared/config/config');
module.exports.chatServerHandler = (ws) => {
  console.log('Client is connected');
  const sessionId = generateUniqueId(50);
  ws.send(JSON.stringify({type: 'INIT_SESSION', sessionId: sessionId}));

  ws.on('open', () => {
    console.log('Connection is open');
  });

  ws.on('close', () => {
    console.log('___________________disconnected');
      for(let i = WS_USER_ARRAY.length-1 ; i>=0; i--){
        if(WS_USER_ARRAY[i].socket.readyState === WS_USER_ARRAY[i].socket.CLOSED){
          console.log('OFFLINE USER');
          WS_USER_ARRAY.splice(i, 1);
        }
      }
  });

  ws.on('message', (msg) => {
    let msgJSON = JSON.parse(msg);
    console.log(msgJSON);

    if (msgJSON.type === 'REGISTER_WS_USER') {
      return registerWSUser(msgJSON);
    }

    if (msgJSON.type === 'NEW_MESSAGE') {
      return saveNewMessage(msgJSON);
    }
  });

  ws.on('error', () =>
      console.log('errored')
  );

  function registerWSUser(msg) {
    console.log('registering...');
    const wsArrayItem = {
      sessionId: msg.sessionId,
      userId: msg.userId,
      socket: ws
    };

    WS_USER_ARRAY.push(wsArrayItem);
    return ws.send(JSON.stringify({
        type: 'REGISTER_WS_USER',
        status: 200
      }
    ));
  }

  function saveNewMessage(msg) {
    console.dir(msg);

    let newMessage = new ChatMessage({
      sender: msg.messageFrom,
      text: msg.messageText,
      attachments: [],
      seen: []
    });

    newMessage.save()
      .then(savedMessage => {
        Chat.findOneAndUpdate(
          {
          '_id': msg.chatId
          },
          {$push: {messages: savedMessage}},
          {new: true}
        ).then(updatedChat => {
          sendNewMessageToSocketClients(updatedChat, savedMessage);
          sendNewMessageNotificationToAdmin(updatedChat, savedMessage);
        }).catch(error => {
          console.dir(error);
        });
      })
      .catch(error => {
        console.dir(error);
      })
  }
};

function sendNewMessageToSocketClients(chat, message) {
  chat.participants.forEach(participant => {
    WS_USER_ARRAY.forEach(wsItem => {
      if (wsItem.userId === participant.toString() && wsItem.socket.readyState === wsItem.socket.OPEN) {
        wsItem.socket.send(JSON.stringify({
          type: 'NEW_MESSAGE',
          status: 200,
          chatId: chat['_id'],
          message: message
        }));
      }
    })
  });
}

function sendNewMessageNotificationToAdmin(chat, message) {
  let sender = null;
  let receiver = null;
  Chat.populate(chat, {path: 'participants'})
      .then(populatedChat => {
        if (populatedChat && populatedChat.participants) {
            populatedChat.participants.forEach(participant => {
              if (message.sender.toString() === participant['_id'].toString()) {
                sender = participant;
              } else {
                receiver = participant;
              }
            })
        }

        if (sender && receiver) {
            let mailBody = 'message From: ' + sender['firstName'] + ' ' + sender['lastName'] + (sender['email']? ('(email: ' + sender['email'] + ')') : ('(Phone: ' + sender['phone'] + ')')) + '<br>'+
                           'message To: ' + receiver['firstName'] + ' ' + receiver['lastName'] + (receiver['email']? ('(email: ' + receiver['email'] + ')') : ('(Phone: ' + receiver['phone'] + ')')) + '<br>'+
                           'Text: ' + message.text;

            mailer.sendMail(config.admin_email, 'New Message', ``, mailBody);
        }

        if (receiver.email) {
            let mailBody = 'You have new message from : ' + sender['firstName'] + ' ' + sender['lastName'] + (sender['email']? ('(email: ' + sender['email'] + ')') : ('(Phone: ' + sender['phone'] + ')')) + '<br>'+
                'Text: ' + message.text;

            mailer.sendMail(receiver.email, 'New Message', ``, mailBody);
        }
      });

}


function generateUniqueId(count) {
  let _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';

  for(var i = 0; i < count; i++) {
    if (i > 0 && i < count - 1 && i%5 === 0) {
      str += '-';
    }
    str += _sym[parseInt(Math.random() * (_sym.length))];
  }
  return str;
}