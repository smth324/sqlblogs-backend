const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog } = require('../models')
const ReadingList = require('../models/readinglist')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const list = await ReadingList.create({
    userId: req.body.userId,
    blogId: req.body.blogId
  })
  res.json(list)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingList = await ReadingList.findOne({
    where: {
      [Op.and]: [{
        userId: {
          [Op.eq]: req.decodedToken.id
        }
      }, {
        blogId: {
          [Op.eq]: req.params.id
        }
      }]
    }
  })
  if (readingList) {
    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)
  } else {
    res.status(404).send({ error: "blog not found or no authorization" })
  }

})

module.exports = router