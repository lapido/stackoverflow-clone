import * as Sequelize  from "sequelize"
import dbConnection from "../../config/db.connection";
import { VoteDto } from "../dto/vote.dto";
import { VoteType } from "../enum/vote.type";
import { Answer } from "./answer.model";
import { User } from "./user.model";

interface VoteModel extends Sequelize.Model<VoteModel, VoteDto> {
    id: number
    userId: number
    answerId: number
    voteType: VoteType
}

export const Vote = dbConnection.getSequelize().define<VoteModel, VoteDto>('vote', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: 'id'
        }
      },
    answerId: {
    type: Sequelize.INTEGER,
    references: {
        model: Answer,
        key: 'id'
        }
    },
    voteType: Sequelize.STRING
      
}, {
    freezeTableName: true,
    underscored: true,
    timestamps: false
}
)