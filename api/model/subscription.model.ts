import * as Sequelize  from "sequelize"
import dbConnection from "../../config/db.connection"
import { Question } from "./question.model"
import { User, UserModel } from "./user.model"

interface SubscriptionDto {
    id?: number
    questionId: number
    userId: number
    status: string
}

interface SubscriptionModel extends Sequelize.Model<SubscriptionModel, SubscriptionDto> {
    id: number
    questionId: number
    userId: number
    status: string
}

export const Subscription = dbConnection.getSequelize().define<SubscriptionModel, SubscriptionDto>('subscription', {
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
    userId: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: 'id'
        }
    },
    status: Sequelize.STRING
}, {
    freezeTableName: true,
    underscored: true,
    timestamps: false
})