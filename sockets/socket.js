const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

let io; // Declare `io` to make it accessible globally

const initializeSocket = (server) => {
  io = new Server(server);

  // Middleware for authenticating socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = isValidToken(token);
      socket.user = decoded; // Attach decoded user data to the socket
      next();
    } catch (err) {
      next(new AppError("Authentication error"));
    }
  });

  // Handle connection event
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.user.id);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.user.id);
    });
  });
};

// Helper function to validate and decode the token
const isValidToken = (token) => {
  if (!token) {
    throw new AppError("Token is missing.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your environment variables
  return {
    id: decoded.id,
    name: decoded.name,
    role: decoded.role,
  };
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized!");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
