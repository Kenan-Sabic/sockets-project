const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Function to generate a unique user ID
function generateUserId() {
  return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
}

// Function to retrieve user details by ID
function getUserById(userId) {
  // You can implement your own logic to fetch user details from a database or any other data source
  // For now, let's return a simple object with the user ID as the name
  return { name: userId };
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = new Map(); // Map to store connected users

io.on('connection', (socket) => {
  console.log('A user connected');

  const userId = generateUserId(); // Generate a unique user ID

  users.set(socket, userId); // Associate the socket with the user ID

  socket.emit('user connected', userId); // Notify the client about their assigned user ID

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    users.delete(socket); // Remove the user from the list when they disconnect
  });

  socket.on('chat message', (msg) => {
    const userId = users.get(socket); // Get the user ID associated with the socket
    const user = getUserById(userId); // You need to implement a function to retrieve user details by ID
    const message = { user: user.name, text: msg.message }; // Access the 'message' property of the 'msg' object
  
    io.emit('chat message', message); // Broadcast the message to all connected clients
  });
  
});

const port = 3000;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
