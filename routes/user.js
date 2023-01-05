const express = require("express");

const { signup, login } = require("../controllers/user");

const router = express.Router();

// router.get("/", (req, res, next) => {
//   res.send("Welcome");
// });

router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
