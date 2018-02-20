let url = require('url');
let WS_USER_ARRAY = [];
let TempUser = require('../api/v1/models/temporary-user.model').model;
let Chat = require('../api/v1/models/chat.model').model;

module.exports.chatServerHandler = (ws) => {
  console.log('Client is there');

  // Welcome message here
  ws.send(JSON.stringify({type: 'handshake'}));

  ws.on('open', () => {
    console.log('User connection is Open');
  });

  ws.on('close', closeConnectionHandler);

  ws.on('message', (request) => {
    console.log('User Message...');

    let msg = JSON.parse(request);
    console.dir(msg);
    // Generate New Session ID
    if (msg.type === 'NEW_SESSION_REQUEST') {
        return createSessionRequestAndRespond();
    }

    if (msg.type === 'REGISTER_TEMP_USER') {
        return registerTemporaryUserAndRespond(msg);
    }

    if (msg.type === 'NEW_MESSAGE') {
        return sendNewMessage(msg);
    }


  });

  function createSessionRequestAndRespond() {
      return ws.send(JSON.stringify({
          status: 200,
          type: 'NEW_SESSION_REQUEST',
          chatSession: generateUniqueId(50)
      }));
  }

  function registerTemporaryUserAndRespond(msg) {
    msg.user.token = msg.token;
    let tempUser = new TempUser(msg.user);
    tempUser.save()
        .then(user => {
            WS_USER_ARRAY.push({
                token: user.token,
                user: user,
                ws: ws
            });
            return ws.send(JSON.stringify({
                status: 200,
                type: 'REGISTER_TEMP_USER',
                user: user
            }));
        })
        .catch(error => {
            console.dir(error);
        });
  }

  function sendNewMessage(msg) {
    Chat.findOne({
        $and: [
            {'users.user': msg['to']['_id']},
            {'users.user': msg['from']['_id']}
        ]
    }).exec()
      .then(chat => {
          console.dir(chat);
          let senderType;
          if (msg.from.type && msg.from.type === 'temp') {
              senderType = 'temporary'
          } else {
              senderType = 'regular';
          }

          if (chat) {
              Chat.findOneAndUpdate(
                  chat['_id'],
                  {$push: {messages: {sender: {type: senderType, user: msg.from['_id']}, text: msg.text}}},
                  {new: true}
              )
                  .then(updatedChat => {
                      console.log('Chat is updated...');
                  })
          } else {
              let chat = new Chat();
              chat.users = [];
              chat.messages = [];
              chat.users.push({type: 'temporary', user: msg.from['_id']});
              chat.users.push({type: 'regular', user: msg.to['_id']});
              chat.messages.push({sender: {type: senderType, user: msg.from['_id']}, text: msg.text});

              chat.save().then(savedChat => {
                  console.log('Chat is saved...');
              }).catch(error => {
                  console.dir(error);
              })
          }
      })
      .catch(error => {
         console.dir(error);
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

  function closeConnectionHandler() {
    console.log('___________________disconnected');

    for(let i = WS_USER_ARRAY.length-1 ; i>=0; i--){
        if(WS_USER_ARRAY[i].ws.readyState === WS_USER_ARRAY[i].ws.CLOSED){
            console.log('OFFLINE USER');
            WS_USER_ARRAY.splice(i, 1);
        }
    }
  }

  function setDeletedFlagForUser(token) {
      TempUser.findOneAndUpdate({token: token}, {deletedFlag: true}, {new: true})
          .then(result => {
              console.log('user flag is set to DELETED');
          })
          .catch(error => {
              console.log('Error while removing user from DB');
          });
  }
};