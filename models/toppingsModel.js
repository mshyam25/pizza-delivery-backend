import mongoose from 'mongoose'

const toppingsSchema = mongoose.Schema(
  {
    sauce: [String],
    cheese: [String],
    veggies: [String],
    meat: [String],
  },
  { timestamps: true }
)

const Toppings = mongoose.model('Toppings', toppingsSchema)

export default Toppings
