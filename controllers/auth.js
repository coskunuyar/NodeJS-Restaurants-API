const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler( async (req,res,next) => {
  const { name , email , password , role } = req.body;
  const user = await User.create({ name , email , password , role  });
  sendTokenResponse(user,200,res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private

exports.getMe = asyncHandler(async (req,res,next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({success: true , data: user});
});

const sendTokenResponse = (user,statusCode,res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token
  });
}



// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req,res,next) => {
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorResponse('There is no such user.',404));
    }
    const resetToken = user.getResetPasswordToken();
    user.save({validateBeforeSave: false});
    res.status(200).json({
      success: true,
      data: user
    })
});