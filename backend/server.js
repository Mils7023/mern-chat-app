const express = require("express");
const dotenv = require('dotenv')
const { chats } = require("./data/data");
const ConnectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const e = require("express");

dotenv.config();
ConnectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chat/:id", (req, res) => {
// //   console.log(req.params.id);
//   const getSingleChat = chats.find((c) => c._id === req.params.id);
//   res.send(getSingleChat);
// });

app.use('api/user', userRoutes)

const PORT = process.env.PORT || 5000 ;

app.listen(5000, console.log(`Server Started on Port ${PORT}`));
