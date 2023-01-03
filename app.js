const express = require("express");
const mongoose = require("mongoose");
const router = require('./routes/user');

const app = express();

app.use("/", (req, res, next) => {
  res.send("Hello There");
});

app.use("/api", router);

var port = 5000;

mongoose
  .connect(
  )
  .then(() => {
    app.listen(port);
    console.log(`Database connection established at ${port}`);
  })
  .catch((err) => console.log(err));
