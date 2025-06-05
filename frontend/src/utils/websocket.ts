const connectWebSocket = () => {
  const ws = new WebSocket('ws://localhost:3001');

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
};

const sendMessage = (message: any) => { // TODO type
  const ws = connectWebSocket();
  ws.send(JSON.stringify(message));
};

export { connectWebSocket, sendMessage };