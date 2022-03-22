import mongoose from 'mongoose'
import chalk from 'chalk'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(chalk.blue(`MongoDB Connected : ${conn.connection.host}`))
  } catch (error) {
    console.log(chalk.red(`Error : ${error.message}`))
    process.exit(1)
  }
}

export default connectDB
