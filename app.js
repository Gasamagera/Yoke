const express = require("express");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");




const app = express();

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

module.exports = app;
