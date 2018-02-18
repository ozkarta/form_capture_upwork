module.exports.chatServerHandler = (ws) => {
  console.log('Client is there');

  // Welcome message here
  ws.send(JSON.stringify({type: 'handshake'}));

  ws.on('open', () => {
    console.log('User connection is Open');
  });

  ws.on('close', () => {
    console.log('User connection is closed');
  });

  ws.on('message', (request) => {
    console.log('User Message...');

    let msg = JSON.parse(request);
    console.dir(msg);
    // Generate New Session ID
    if (msg.type === 'NEW_SESSION_REQUEST') {

        return ws.send(JSON.stringify({
            type: 'NEW_SESSION_REQUEST',
            chatSession: generateUniqueId(50)
        }));

    }
  });


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
};