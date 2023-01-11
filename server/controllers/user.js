const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "myKeymyKey";

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
  console.log(`created ${user.name}`);
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
  // genrate the web token, when the user and password are correct
  const webToken = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, {
    expiresIn: "30s",
  });
  // set cookies
  res.cookie(String(existingUser._id), webToken, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: "lax",
  });
  console.log(`login ${existingUser.email}`);
  return res
    .status(201)
    .json({ message: "sucessfully login", user: existingUser, webToken });
};

const verifyToken = (req, res, next) => {
  // const headers = req.headers[`authorization`];
  // const token = headers.split(" ")[1];
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  console.log(token);
  if (!token) {
    res.status(404).json({ message: "No token available" });
  }
  jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
    console.log(user.id);
    req.id = user.id;
  });

  next();
};

const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (error) {
    return new Error(error);
  }
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  console.log(user);
  res.status(200).json({ user });
  return;
};

// const refreshToken

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
