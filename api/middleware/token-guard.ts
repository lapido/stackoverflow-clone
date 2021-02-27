import { IncomingHttpHeaders } from 'http';
import { RequestHandler } from 'express'
import UserService from '../service/user.service'


function getTokenFromHeaders(headers: IncomingHttpHeaders) {
  const header = headers.authorization as string

  if (!header)
    return header

  return header.split(' ')[1]
}

const tokenGuard: (() => RequestHandler) = (() => (req, res, next) => {

  const token = getTokenFromHeaders(req.headers) || req.query.token || req.body.token || ''
  const hasAccess = UserService.verifyToken(token)

  hasAccess.then(a => {
    if (!a)
      return res.status(401).send({ message: 'Access denied' })
    next()
  })
})

export default tokenGuard