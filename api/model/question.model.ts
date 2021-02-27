import * as Sequelize  from "sequelize"
import dbConnection from '../../config/db.connection'
import { QuestionDto } from '../dto/question.dto'
import { User } from './user.model'

interface QuestionModel extends Sequelize.Model<QuestionModel, QuestionDto> {
    id: number
    userId: number
    title: string
    body: string
}

export const Question = dbConnection.getSequelize().define<QuestionModel, QuestionDto>('question', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.STRING,
    body: Sequelize.STRING,
    userId: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: 'id'
        }
      }
}, {
    freezeTableName: true,
    underscored: true,
    timestamps: false
})

console.log("I got here oh")
User.hasMany(Question)