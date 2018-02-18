module.exports.chatServerHandler = (ws) => {
  console.log('Client is there');

  // Welcome message here
  ws.send(JSON.stringify({wsMessage: 'Welcome There'}));

  ws.on('open', () => {
    console.log('User connection is Open');
  });

  ws.on('close', () => {
    console.log('User connection is closed');
  });

  ws.on('message', (message) => {
    console.log('User Message...');
    console.log(message);
  })

};