const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { blogFinder, tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search
          }
        }, {
          author: {
            [Op.substring]: req.query.search
          }
        }
      ]
    }
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.status(200).json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
  return res.status(201).json(blog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: "malformatted id" })
  }
  if (req.blog.userId === req.decodedToken.id) {
    req.blog.destroy()
    return res.status(201).end()
  }
  console.log('faield')
  res.status(401).send({ error: "No authorization" })
})

router.put('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
  if (!req.blog) {
    return res.status(404).json({ error: "malformatted id" })
  }
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

module.exports = router