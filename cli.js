require('dotenv').config()
const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})
//asd
class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})
Blog.sync()
const main = async () => {
  try {
    const result = await Blog.findAll()
    console.log(`${result[0].dataValues.author}: '${result[0].dataValues.title}', ${result[0].dataValues.likes} likes`)
    console.log(`${result[1].dataValues.author}: '${result[1].dataValues.title}', ${result[1].dataValues.likes} likes`)
    const notes = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    console.log(notes)
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()