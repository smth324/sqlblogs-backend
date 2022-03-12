const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const { User, Blog } = require('../models')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['passwordHash'] },
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    const passwordHash = await bcryptjs.hash(req.body.password, 10)
    const user = await User.create({
        username: req.body.username,
        name: req.body.name,
        passwordHash,
    })
        res.json({
            id: user.id,
            username: user.username,
            name: user.name,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt
        })
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
    user.username = req.body.username
    await user.save()
    res.json(user)
})

router.get('/:id', async (req, res) => {
    let read = {
        [Op.in]: [true, false]
    }
    if (req.query.read) {
        read = req.query.read === "true"
    }
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt', 'id'] },
        include: [{
            model: Blog,
            as: 'readings',
            attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
            through: {
                attributes: ['read', 'id'],
                as: 'readinglists',
                where: {
                    read
                }
            }
        }]
    })
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ error: "user doesn't exist"})
    }
})

module.exports = router