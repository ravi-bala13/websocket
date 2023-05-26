const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());

// creating the server by creating instance of server class
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

// Store active WebSocket connections
const connections = new Map();

// connecting websocket server
io.on("connection", (socket) => {
  // console.log("req:", req.query);
  console.log("socketId:", socket.id);

  // Store the WebSocket connection with a unique identifier or username
  const { userId } = socket.handshake.query; // Replace with your own logic to generate a unique identifier
  console.log("userId:", userId);
  connections.set(userId, socket);
  console.log("connections:", connections.keys());

  // socket.on("join_room", (data) => {
  //   socket.join(data);
  //   console.log(`User with ID: ${socket.id} joined room: ${data}`);
  // });

  socket.on("send_message", (data) => {
    console.log("data:", data);
    // socket.to(data.room).emit("receive_message", data);

    const { recipient } = data;
    console.log("recipient:", recipient);

    // Find the WebSocket connection for the recipient
    const recipientWs = connections.get(recipient);
    console.log("recipientWs:", recipientWs.send);

    if (recipientWs) {
      // Send the message to the recipient
      recipientWs.emit("receive_message", data);
      // socket.emit("receive_message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Hey i am listening on 3001");
});
