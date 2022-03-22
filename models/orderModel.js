import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        qty: { type: Number, required: true },
        pizzaPrice: { type: Number, required: true },
        VeggiePrice: { type: Number, required: true, default: 0 },
        meatPrice: { type: Number, required: true, default: 0 },
        totalPrice: { type: Number, required: true },
      },
    ],

    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    deliveryAddress: {
      address: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    deliveryCharges: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    isReceived: {
      type: Boolean,
      required: true,
      default: false,
    },
    receivedAt: {
      type: Date,
    },

    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

export default Order
