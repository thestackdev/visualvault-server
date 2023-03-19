import { getToken } from 'next-auth/jwt'

export default async function authorize(req, res, next) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' })
  }
  console.log(req)
  req.token = token
  next()
}
