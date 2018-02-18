module.exports.chatServerHandler = (ws) => {

  // Welcome message here
  ws.send(JSON.stringify({}));

  ws.on('close', () => {
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