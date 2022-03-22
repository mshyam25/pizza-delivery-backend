import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import expressAsyncHandler from 'express-async-handler'
import { request } from 'express'

const protect = expressAsyncHandler(async (request, response, next) => {
  let token

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = request.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.SECRET_KEY)

      request.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      response.status(401)
      throw new Error('Not authorized, token failed')
    }
  } else {
    response.status(401)
    throw new Error('Not authorized, No token')
  }
})

const admin = expressAsyncHandler(async (request, response, next) => {
  if (request.user && request.user.isAdmin) {
    next()
  } else {
    response.status(401)
    throw new Error('Not authroized as admin')
  }
})

export { protect, admin }
