const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const { SECRET } = require('../util/config')
const { User, Token } = require('../models')

router.post('/', async (request, response) => {
  const body = request.body
  if (!body.username) {
    return response.status(401).json({
      error: 'invalid username or passwords'
    })
  }
  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcryptjs.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)
  await Token.create({ token })
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router