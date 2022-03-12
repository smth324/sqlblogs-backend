const router = require('express').Router()
const { Token } = require('../models')

router.delete('/', async (req, res) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.substring(7)
        const tokenToDelete = await Token.findOne({
            where: {
                token
            }
        })
        if (!tokenToDelete) {
            return res.status(401).json({ error: 'token invalid' })
        }
        console.log(tokenToDelete)
        tokenToDelete.destroy()
        return res.status(201).end()
    } else {
        res.status(401).json({ error: 'token missing' })
    }
})

module.exports = router