const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const CORS = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

const corsOptions = {
  origin: "http://localhost:5000",
  credentials: true, //access-control-allow-credentials:true
  // optionSuccessStatus: 200,
};

app.use(CORS(corsOptions));

app.use("/api", router);

app.use(cookieParser());
app.use(express.json());

var PORT = 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connection established on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
