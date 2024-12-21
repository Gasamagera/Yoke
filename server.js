const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { initializeSocket } = require("./sockets/socket");

dotenv.config({ path: "./.env" });
const app = require("./app");

const server = http.createServer(app); // Create an HTTP server with the app

// Initialize Socket.IO
initializeSocket(server);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  encodeURIComponent(process.env.DATABASE_PASSWORD)
);
mongoose.connect(DB).then((con) => {
  console.log("DATABASE Connection Successful");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
