import User from '../models/userModel.js'
import expressAsyncHandler from 'express-async-handler'
import { generateToken } from '../utils/generateToken.js'
import VerificationToken from '../models/tokenModel.js'
import Security from '../models/securityModel.js'
import verifyMail from '../utils/verifyMail.js'

//@description Get security questions
//@route  GET /securityquestions
//@access Public

const securityQuestions = expressAsyncHandler(async (request, response) => {
  const questions = await Security.find({})

  if (questions) {
    response.json(questions)
  } else {
    response.status(404)
    throw new Error('Invalid request')
  }
})

//@description User Sign in
//@route       POST /users/signin
//@access      Public

const userSignIn = expressAsyncHandler(async (request, response) => {
  const { email, password } = request.body
  const user = await User.findOne({ email })

  if (user && (await user.passwordMatchCheck(password))) {
    if (user.isVerified) {
      response.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      response.status(404)
      throw new Error('Account not verified')
    }
  } else {
    response.status(404)
    throw new Error('Invalid User Credentials')
  }
})

//@description Register a new user
//@route       POST /users
//@access      Public

const registerUser = expressAsyncHandler(async (request, response) => {
  const { name, email, password, securityQues, securityQuestionAnswer } =
    request.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    response.status(404)
    throw new Error('User already exists')
  } else {
    const user = await User.create({
      name,
      email,
      password,
      securityQuestion: securityQues,
      securityQuestionAnswer,
    })
    if (user) {
      verifyMail(user, request)
      response.status(201)
      response.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      response.status(400)
      throw new Error('Invalid user data')
    }
  }
})

//@description Find USer by email id
//@route POST /users/userbyemail
//@access Public

const getUserByEmail = expressAsyncHandler(async (request, response) => {
  const { email } = request.body
  const user = await User.findOne({ email })
  console.log(user)
  if (user) {
    response.status(200)
    response.send(user)
  } else {
    response.status(404)
    throw new Error('Email does not belong to any user')
  }
})

//@description Confirm user
//@route POST /users/userconfirmation
//@access Public

const confirmUser = expressAsyncHandler(async (request, response) => {
  const { securityAnswer, email } = request.body
  const user = await User.findOne({ email })

  if (user.securityQuestionAnswer === securityAnswer) {
    response.status(200)
    response.send('User confirmed')
  } else {
    response.status(404)
    throw new Error('Incorrect answer')
  }
})

//@description Get User details
//@route       GET /users/profile
//@access      Private

const getUserDetails = expressAsyncHandler(async (request, response) => {
  const user = await User.findById(request.user._id)
  if (user) {
    response.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    response.status(404)
    throw new Error('User not found')
  }
})

//@description Delete User
//@route       DELETE /users/userdelete
//@access      Private

const userDelete = expressAsyncHandler(async (request, response) => {
  const user = await User.findById(request.params.id)
  if (user) {
    await user.remove()
    response.json('User removed')
  } else {
    response.status(404)
    throw new Error('User not found')
  }
})
//@description Update user details
//@route       PUT /users/profile
//@access      Private

const updateUserDetails = expressAsyncHandler(async (request, response) => {
  const { name, email, password } = request.body
  const user = await User.findById(request.user._id)
  if (user) {
    user.name = name || user.name
    user.email = email || user.email
    if (password) {
      user.password = password
    }
    const updatedUser = await user.save()
    response.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    response.status(404)
    throw new Error('User not found')
  }
})

//@description Update Password
//@route       PUT /users/passwordreset
//@access      Public

const updatePassword = expressAsyncHandler(async (request, response) => {
  const { email, password } = request.body
  const user = await User.findOne({ email })
  if (user) {
    user.password = password
    const updatedUser = await user.save()
    response.send('Password Updated.Please signin with your new password')
  } else {
    response.status(404)
    throw new Error('User not found')
  }
})

//@description Get all users
//@route       GET /users
//@access      Private Admin

const getUsers = expressAsyncHandler(async (request, response) => {
  const users = await User.find({})
  if (users) {
    response.send(users)
  } else {
    response.status(404)
    throw new Error('Invalid request')
  }
})

//@description email verification
//@route  /confirmation
//@access  public

const confirmEmail = expressAsyncHandler(async (request, response) => {
  const { email, token } = request.params
  const validToken = await VerificationToken.findOne({ token: token })
  if (validToken) {
    const user = await User.findById(validToken._userId)
    if (user.isVerified) {
      response.status(200).send('User has been already verified. Please Login')
    }
    user.isVerified = true
    const updatedUser = await user.save()
    response.status(500).send({
      message: 'Account verified',
      email: updatedUser.email,
      signin: `http://${request.headers.host}/signin`,
    })
  } else {
    response.status(404)
    response.send({
      message:
        'Your verification link may have expired. Please click on resend for verify your Email',
      resendlink: `http://${request.headers.host}/resendconfirmation/${email}`,
    })
  }
})

const resendConfirmation = expressAsyncHandler(async (request, response) => {
  const { email } = request.params
  const user = await User.findOne({ email: email })
  if (user) {
    if (user.isVerified) {
      response.status(500).send('Account already Verified')
    } else {
      verifyMail(user, request)
    }
  } else {
    response.status(404)
    throw new Error('Invalid user')
  }
})

export {
  registerUser,
  userSignIn,
  getUserDetails,
  updateUserDetails,
  getUsers,
  confirmEmail,
  resendConfirmation,
  securityQuestions,
  getUserByEmail,
  confirmUser,
  updatePassword,
  userDelete,
}
