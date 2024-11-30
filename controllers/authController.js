const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) Check if email and password exist(has been put into body)
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Provide Password and Email", 400));
  }

  //2) Check if password and email is correct

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Password or Email", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.header.authorization &&
    req.header.authorization.startWith("Beaerer")
  ) {
    token = req.header.authorization.split(" ")[1];
  }
  if (!token) {
    next(
      new AppError("you are not Logged in! Please Log in to get access ", 401)
    );
  }

  next();
});
