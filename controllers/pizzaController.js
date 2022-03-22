import expressAsyncHandler from 'express-async-handler'
import Pizza from '../models/pizzaModel.js'
import Toppings from '../models/toppingsModel.js'

//@description  Fetch all pizzas
//@route        GET /pizzas
//@access       Public
const getPizzas = expressAsyncHandler(async (request, response) => {
  const pizzas = await Pizza.find({})
  if (pizzas) {
    response.json(pizzas)
  } else {
    response.status(404)
    throw new Error('Invalid request')
  }
})

//@description Get Pizza by id
//@route       GET /pizzas/customise/:id
//@access      Public

const getPizzaById = expressAsyncHandler(async (request, response) => {
  const pizza = await Pizza.findById(request.params.id)

  if (pizza) {
    response.json(pizza)
  } else {
    response.status(404)
    throw new Error('Pizza not found')
  }
})

//@description GET toppings
//@route  /pizzas/toppings
//@access Public

const getToppings = expressAsyncHandler(async (request, response) => {
  const toppings = await Toppings.find({})

  if (toppings) {
    response.json(toppings)
  } else {
    response.status(404)
    throw new Error('Invalid request')
  }
})

export { getPizzas, getPizzaById, getToppings }
