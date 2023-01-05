const express = require("express");
const mongoose = require("mongoose");
const router = require('./routes/user');

const app = express();

// app.use("/", (req, res, next) => {
//   res.send("Hello There");
// });

app.use(express.json())

app.use("/api", router);

var port = 5000;

mongoose
  .connect(
    "mongodb+srv://vinnie:09032272261@auth.p3jee03.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port);
    console.log(`Database connection established at ${port}`);
  })
  .catch((err) => console.log(err));

