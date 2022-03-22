import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  createOrder,
  getOrderById,
  getOrders,
  getUserOrders,
  orderConfirmation,
  orderDelivery,
  orderPaymentSuccess,
} from '../controllers/orderController.js'

const router = express.Router()

router.route('/').get(protect, admin, getOrders).post(protect, createOrder)
router.route('/myorders').get(protect, getUserOrders)

router.route('/:id').get(protect, getOrderById)
router.route('/confirm/:id').put(protect, admin, orderConfirmation)
router.route('/deliver/:id').put(protect, admin, orderDelivery)
router.route('/payment/:id').put(protect, orderPaymentSuccess)
router.route('/myorders').get(protect, getUserOrders)

export const orderRoutes = router
