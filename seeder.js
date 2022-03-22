import dotenv from 'dotenv'
import users from './data/userData.js'
import pizzaBase from './data/pizzaData.js'
import { toppings } from './data/toppingsData.js'
import Pizza from './models/pizzaModel.js'
import Toppings from './models/toppingsModel.js'
import User from './models/userModel.js'
import VerificationToken from './models/tokenModel.js'
import Security from './models/securityModel.js'
import { securityQuestionData } from './data/securityData.js'
import connectDB from './config/db.js'
import chalk from 'chalk'

dotenv.config()
await connectDB()

const importData = async () => {
  try {
    await User.deleteMany()
    await Pizza.deleteMany()
    await Toppings.deleteMany()
    await VerificationToken.deleteMany()
    await Security.deleteMany()

    await User.insertMany(users)
    await Pizza.insertMany(pizzaBase)
    await Toppings.create(toppings)
    await Security.create(securityQuestionData)

    console.log(chalk.green('Data Imported!'))
    process.exit()
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await User.deleteMany()

    console.log(chalk.red('Data Destroyed!'))
    process.exit()
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
