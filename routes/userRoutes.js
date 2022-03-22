import express from 'express'
import {
  confirmUser,
  getUserByEmail,
  getUserDetails,
  getUsers,
  registerUser,
  securityQuestions,
  updatePassword,
  updateUserDetails,
  userDelete,
  userSignIn,
} from '../controllers/userController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.route('/securityquestions').get(securityQuestions)
router.route('/signin').post(userSignIn)
router
  .route('/profile')
  .get(protect, getUserDetails)
  .put(protect, updateUserDetails)
router.route('/userbyemail').post(getUserByEmail)
router.route('/userconfirmation').post(confirmUser)
router.route('/passwordreset').put(updatePassword)
router.route('/delete/:id').delete(userDelete)
export const userRoutes = router
