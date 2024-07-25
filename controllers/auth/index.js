const bcrypt = require("bcrypt");

const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/ApiError");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
exports.Register = asyncHandler(async (req, res, next) => {
  const { fullname, phone, password, email, sex, age } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ status: false, data: "user exist" });
  }

  // Generate a random code

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user object with default values
  const userObject = {
    fullname,
    phone,
    email,
    sex,
    password: hashedPassword,
    age,
  };
  console.log(userObject);

  const newUser = await User.create(userObject);

  res.status(201).json({ status: true, data: newUser });
});

exports.Login = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user._id }, "mysecretkey", {
      expiresIn: "5h",
    });
    res.status(200).json({ status: true, data: { user, token } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});
