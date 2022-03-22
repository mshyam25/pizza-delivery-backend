import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    isVerified: true,
    securityQuestion: 'Who is favourite cricketer ?',
    securityQuestionAnswer: 'Tewatia',
  },
]
export default users
