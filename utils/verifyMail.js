import nodemailer from 'nodemailer'
import expressAsyncHandler from 'express-async-handler'
import crypto from 'crypto'
import VerificationToken from '../models/tokenModel.js'

const verifyMail = expressAsyncHandler(async (user, request) => {
  const token = await VerificationToken.create({
    _userId: user._id,
    token: crypto.randomBytes(16).toString('hex'),
  })
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'noreplytestermail@gmail.com',
      pass: 'Nowuseeme@22',
    },
  })

  const mailOptions = {
    from: 'noreplytestermail@gmail.com',
    to: user.email,
    subject: 'Account Verification Link',
    text: `Hello <h1>${user.name}</h1>,\n\n 'Please verify your account by clicking the link : \n
   http://${request.headers.host}/confirmation/${user.email}/${token.token}   \n\nThank You\n`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error)
    else {
      console.log('Mail sent')
      return true
    }
  })
})

export default verifyMail
