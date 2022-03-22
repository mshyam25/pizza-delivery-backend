import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import chalk from 'chalk'
import { pizzaRoutes } from './routes/pizzaRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import { userRoutes } from './routes/userRoutes.js'
import { orderRoutes } from './routes/orderRoutes.js'

import cors from 'cors'
import {
  confirmEmail,
  resendConfirmation,
} from './controllers/userController.js'

dotenv.config()
const app = express()

connectDB()
app.use(express.json())
app.use(cors())
app.use('/users', userRoutes)
app.use('/pizzas', pizzaRoutes)
app.use('/orders', orderRoutes)
app.get('/confirmation/:email/:token', confirmEmail)
app.get('/resendconfirmation/:email', resendConfirmation)
app.get('/paypalclient', async (request, response) => {
  response.send(process.env.PAYPAL_CLIENT_ID)
})

app.get('/', (req, res) => {
  res.send('WElcome')
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(
    chalk.yellow(`Server started in Development mode on port ${PORT}`)
  )
})
