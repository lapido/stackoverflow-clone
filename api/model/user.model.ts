import * as Sequelize  from "sequelize";
import dbConnection from '../../config/db.connection';
import { UserDto } from '../dto/user.dto'
import { Answer } from "./answer.model";
import { Question } from "./question.model";
import { Subscription } from "./subscription.model";
import { Vote } from "./vote.model";

export interface UserModel extends Sequelize.Model<UserModel, UserDto> {
    id: number;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    title: string;
    websiteLink: string;
    twitterUsername: string;
    githubUsername: string;
    password: string;
    timestamp_created: number;
    timestamp_updated: number;
}

export const User = dbConnection.getSequelize().define<UserModel, UserDto>('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    displayName: Sequelize.STRING,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    location: Sequelize.STRING,
    title:Sequelize.STRING,
    websiteLink: Sequelize.STRING,
    twitterUsername: Sequelize.STRING,
    githubUsername: Sequelize.STRING,
    password: Sequelize.STRING
}, {
    freezeTableName: true,
    underscored: true,
    timestamps: false
})

User.hasMany(Subscription, {foreignKey: {name: "userId", allowNull: false}, sourceKey: "id"})
Subscription.belongsTo(User, {foreignKey: {name: "userId", allowNull: false}, targetKey: "id"})


