import * as Sequelize  from "sequelize"
import dbConnection from "../../config/db.connection"
import { Question } from "./question.model"
import { User, UserModel } from "./user.model"
import {BelongsToGetAssociationMixin} from "sequelize"

export const Subscription = dbConnection.getSequelize().define('subscription', {
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