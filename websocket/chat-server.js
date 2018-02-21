let url = require('url');
let WS_USER_ARRAY = [];
let TempUser = require('../api/v1/models/temporary-user.model').model;
let RegularUser = require('../api/v1/models/user.model').model;
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



    if (msg.token) {
        let wsUser
        for(let i = WS_USER_ARRAY.length-1 ; i>=0; i--){
            if (WS_USER_ARRAY[i].token === msg.token) {
                console.log('Token match')
                wsUser = WS_USER_ARRAY[i];
            }
        }

        if (wsUser) {
            handleUserRequests();
        } else {
           if (msg.usr) {
               if (msg.usr.type === 'temporary') {
                   TempUser.findById(msg.usr.id)
                       .lean()
                       .then(user => {
                           WS_USER_ARRAY.push({
                               token: user.token,
                               user: {
                                   type: 'temporary',
                                   usr: user
                               },
                               ws: ws
                           });
                           handleUserRequests();
                       })
               }
               if (msg.usr.type === 'regular') {
                   RegularUser.findById(msg.usr.id)
                       .lean()
                       .then(user => {
                           WS_USER_ARRAY.push({
                               token: msg.token,
                               user: {
                                   type: 'regular',
                                   usr: user
                               },
                               ws: ws
                           });
                           handleUserRequests();
                       })
               }
           } else {
               if (msg.type === 'REGISTER_TEMP_USER') {
                   return registerTemporaryUserAndRespond(msg);
               }
           }
        }
    }


    function handleUserRequests() {

        if (msg.type === 'NEW_MESSAGE') {
            return sendNewMessage(msg);
        }

        if (msg.type === 'CHAT_LIST_REQUEST') {
            return getChatList(msg.user);
        }
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
            console.log(user);
            WS_USER_ARRAY.push({
                token: user.token,
                user: {
                    type: 'temporary',
                    usr: user
                },
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
      let query = {
          $and: [
              {'users.user._id': msg['to']['_id']},
              {'users.user._id': msg['from']['_id']}
          ]
      };
      console.log(query);

    Chat.find(query).lean().exec()
      .then(chats => {
          console.log('_________________________');
          console.log('_________________________');
          let chat = chats[0];
          console.log(chat);
          let senderType;
          if (msg.from.type && msg.from.type === 'temp') {
              senderType = 'temporary'
          } else {
              senderType = 'regular';
          }

          if (chat) {
              if (msg.text) {
                  Chat.findOneAndUpdate(
                      {_id: chat['_id']},
                      {$push: {messages: {sender: {type: senderType, user: msg.from['_id']}, text: msg.text}}},
                      {new: true}
                  )
                      .then(updatedChat => {
                          console.log('Chat is updated...');
                          sendUpdatedChatToUsers(updatedChat);
                      })
                      .catch(error => {
                          console.dir(error);
                      })
              }
          } else {
              let chat = new Chat();
              chat.users = [];
              chat.messages = [];
              chat.users.push({type: 'temporary', user: msg.from});
              chat.users.push({type: 'regular', user: msg.to});
              if (msg.text) {
                  chat.messages.push({sender: {type: senderType, user: msg.from['_id']}, text: msg.text});
              }


              chat.save().then(savedChat => {
                  console.log(savedChat);
                  console.log('Chat is saved...');
                  sendUpdatedChatToUsers(savedChat);
              }).catch(error => {
                  console.dir(error);
              })
          }
      })
      .catch(error => {
         console.dir(error);
      });
  }

  function sendUpdatedChatToUsers(chat) {

      WS_USER_ARRAY.forEach(wsUser => {
          chat.users.forEach(chatUser => {
            console.log(chatUser.user['_id'] + ' VS ' + wsUser.user.usr['_id'])
            if (chatUser.user['_id'].toString() === wsUser.user.usr['_id'].toString()) {
                console.log('Match Found');
                wsUser.ws.send(JSON.stringify({type: 'UPDATE_CHAT', status: 200, chat: chat}));
            }
          });
      });
  }

  function getChatList(user) {
      Chat.find({'users.user._id': user})
          .exec()
          .then(chatList => {
              ws.send(JSON.stringify({type: 'CHAT_LIST_REQUEST', status: 200, chats: chatList}));
          })
          .catch(error => {
              console.dir(error);
          })
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