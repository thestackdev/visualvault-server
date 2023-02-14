import { getToken } from 'next-auth/jwt'

export default async function authorize(req, res, next) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' })
  }
  next()
  req.token = token
}
