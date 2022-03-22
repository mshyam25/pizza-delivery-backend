import Order from '../models/orderModel.js'
import expressAsyncHandler from 'express-async-handler'

//@description  GET All orders
//@route        /orders
//@access       Public

const getOrders = expressAsyncHandler(async (request, response) => {
  const orders = await Order.find({})
  if (orders) {
    response.send(orders)
  } else {
    response.status(404)
    throw new Error('No Orders exist')
  }
})

//@description  GET USer orders
//@route        /orders/userorders
//@access       Private

const getUserOrders = expressAsyncHandler(async (request, response) => {
  const orders = await Order.find({ user: request.user._id })
  if (orders) {
    response.send(orders)
  } else {
    response.status(404)
    throw new Error('No Orders exist')
  }
})

//@description  Create new order
//@route        POST /orders
//@access       Private

const createOrder = expressAsyncHandler(async (request, response) => {
  const {
    orderItems,
    paymentMethod,
    deliveryAddress,
    taxPrice,
    deliveryCharges,
    totalPrice,
  } = request.body
  if (orderItems && orderItems.length === 0) {
    response.status(400)
    throw new Error('No order items found')
  } else {
    const order = new Order({
      user: request.user._id,
      orderItems,
      paymentMethod,
      deliveryAddress,
      taxPrice,
      deliveryCharges,
      totalPrice,
    })
    const createdOrder = await order.save()
    response.status(201)
    response.send(createdOrder)
  }
})

//@description  GET order by id
//@route        /orders/:id
//@access       Public

const getOrderById = expressAsyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    response.send(order)
  } else {
    response.status(404)
    throw new Error('Order not found')
  }
})

//@description   PUT order paid status update
//@route        /orders/payment/:id
//@access       Private

const orderPaymentSuccess = expressAsyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    order.isPaid = true
    order.paymentResult = request.body.paymentResult
    order.paidAt = Date()
    const updatedOrder = await order.save()
    response.send(updatedOrder)
  } else {
    response.status(404)
    throw new Error('Order not found')
  }
})

//@description   PUT Order confirmation
//@route        /orders/confirm/:id
//@access       Private Admin

const orderConfirmation = expressAsyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    order.isReceived = true

    order.receivedAt = Date()
    const updatedOrder = await order.save()
    response.send(updatedOrder)
  } else {
    response.status(404)
    throw new Error('Order not found')
  }
})

//@description   PUT Order delivery update
//@route        /orders/deliver/:id
//@access       Private Admin

const orderDelivery = expressAsyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    order.isDelivered = true

    order.deliveredAt = Date()
    const updatedOrder = await order.save()
    response.send(updatedOrder)
  } else {
    response.status(404)
    throw new Error('Order not found')
  }
})
export {
  getOrders,
  getUserOrders,
  createOrder,
  getOrderById,
  orderPaymentSuccess,
  orderConfirmation,
  orderDelivery,
}
