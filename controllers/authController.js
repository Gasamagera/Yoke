const jwt = require("jsonwebtoken");
const { promisify } = require("util");
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
  //1) Getting Token and Check of It's there
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
  // 2)  checking if the token hasn't been manipulated (Verification Token)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3)  To Check if The Owner of token is still exist
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError("The User belonging to this Token is no longer exist", 401)
    );
  }

  //4) Checking If a User changed password after Token was Issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});
