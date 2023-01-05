const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { response } = require("express");
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existinUser;
  try {
    existinUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }
  if (existinUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }

  return res.status(201).json({ message: user });
};

// LOGIN
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return new Error(err);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User not found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(404).json({ message: "invalid email / password" });
  }
  return res.status(201).json({ message: "sucessfully login" });
};

exports.signup = signup;
exports.login = login;
