import tokenService from '../services/tokenService'
import dbUserService from '../services/dbUserService'

function adminMiddleware (req: any, res: any, next: any) {
  if (req.cookies.authorization == null) {
    res.sendStatus(401)
  }

  const decodedWebToken = tokenService.decodeWebToken(req.cookies.authorization)

  if (decodedWebToken == null) {
    res.status(401).send('Admin: Invalid token')
  } else {
    dbUserService.getUserById(decodedWebToken.id).then(user => {
      if (user == null) {
        return res.status(401).send('User not in database')
      } else if (user.is_admin) {
        console.info('Authorized Admin: ' + user.user_name)
        next()
      } else {
        res.status(401).send('Admin:  user is not an admin')
      }
    }).catch(err => console.error(err))
  }
}

export default adminMiddleware
