import mongoose from 'mongoose'

const securitySchema = mongoose.Schema(
  {
    question: [String],
  },
  { timestamps: true }
)

const Security = mongoose.model('Security', securitySchema)

export default Security
