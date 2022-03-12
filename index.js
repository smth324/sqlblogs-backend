const express = require('express')
const app = express()
require('express-async-errors')
const { PORT } = require('./util/config')
const { connectToDatabase, runMigrations } = require('./util/db')
const { errorHandler } = require('./util/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')
const readingListRuter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')
//asd
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readingListRuter)
app.use('/api/logout', logoutRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()