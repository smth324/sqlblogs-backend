const { Blog, Token } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message })
    }
    if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    return next()
}

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            const token = await Token.findOne({
                where: {
                    token: authorization.substring(7)
                }
            })
            if (!token) {
                return res.status(401).json({ error: 'token invalid' })
            }
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)

        } catch {
            res.status(401).json({ error: 'token invalid' })
        }
    } else {
        res.status(401).json({ error: 'token missing' })
    }
    next()
}

module.exports = { errorHandler, blogFinder, tokenExtractor }
