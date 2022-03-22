import express from 'express'
import {
  getPizzaById,
  getPizzas,
  getToppings,
} from '../controllers/pizzaController.js'

const router = express.Router()

router.route('/').get(getPizzas)
router.route('/toppings').get(getToppings)
router.route('/customise/:id').get(getPizzaById)

export const pizzaRoutes = router
