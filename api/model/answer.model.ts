import * as Sequelize  from "sequelize"
import dbConnection from '../../config/db.connection'
import { AnswerDto } from "../dto/answer.dto"
import { User } from './user.model'
import { Question } from './question.model'
import { Vote } from "./vote.model"

interface AnswerModel extends Sequelize.Model<AnswerModel, AnswerDto> {
    id: number
    userId: number
    questionId: number
    body: string
}

export const Answer = dbConnection.getSequelize().define<AnswerModel, AnswerDto>('answer', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    questionId: {
        type: Sequelize.INTEGER,
        references: {
          model: Question,
          key: 'id'
        }
    },
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

