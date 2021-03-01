import {UserDto} from "../dto/user.dto";
import * as bcrypt from 'bcrypt'
import {User, UserModel} from '../model/user.model'
import * as jwt from 'jsonwebtoken'
import debug from 'debug';
import ResponseCode from '../enum/response.code'
import JwtPayload from "./interface/jwt.payload";
import ConfigProperty from "../../config/env.config";
import { UserResponseDto } from "../dto/response/user-response.dto";

const log: debug.IDebugger = debug('app:users-service');

class UserService {
    private readonly _saltRounds = +ConfigProperty.SaltRound
    private readonly _jwtSecret = ConfigProperty.JwtSecret
    private readonly _jwtExpiresIn = ConfigProperty.JwtExpiresIn
    private static instance: UserService;

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    async register(userDto: UserDto) {
        const user = await User.findOne({where: {email: userDto.email}})
        if (user != null) {
            return ResponseCode.USER_ALREADY_EXISTS
        }
        return await bcrypt.hash(userDto.password, this._saltRounds)
            .then(hash => {
                return User.create({
                    displayName: userDto.displayName,
                    firstName: userDto.firstName,
                    lastName: userDto.lastName,
                    email: userDto.email,
                    title: userDto.title,
                    location: userDto.location,
                    githubUsername: userDto.githubUsername,
                    twitterUsername: userDto.twitterUsername,
                    websiteLink: userDto.websiteLink,
                    password: hash
                })
                .then(user => {
                    return this.buildDto(user)
                })
            })
            .catch(e => {
                log('Error: ', e)
                return ResponseCode.SYSTEM_ERROR
            })
    }

    async update(id: number, userDto: UserDto) {
        const user = await User.findByPk(id)
                            .catch((e) => {
                                log("Error: ", e)
                                return ResponseCode.SYSTEM_ERROR
                            })
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }
    
        return User.update({
            displayName: userDto.displayName,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            email: userDto.email,
            title: userDto.title,
            location: userDto.location,
            githubUsername: userDto.githubUsername,
            twitterUsername: userDto.twitterUsername,
            websiteLink: userDto.websiteLink
            }, { where: {id: id}})
            .then(num => {
                if (num[0] === 1) {
                    return ResponseCode.USER_RECORD_UPDATED
                }
                else {
                    return ResponseCode.UPDATE_FAILED
                }
            })
            .catch(err => {
                log('Error: ', err)
                return ResponseCode.SYSTEM_ERROR
            })

    }

    async getUserById(id: number) {
        const user = await User.findByPk(id)
                                .then (data => {
                                    if (data) {
                                        this.buildDto(data)
                                    }
                                })
                                .catch(e => {
                                    log('Error: ', e)
                                    return ResponseCode.SYSTEM_ERROR
                                })
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }

        return user
    }

    async getUserByEmail(email: string) {
        const user = await User.findOne({ where: {email: email}})
                                .then (data => {
                                    if (data) {
                                        this.buildDto(data)
                                    }
                                })
                                .catch(e => {
                                    log('Error: ', e)
                                    return ResponseCode.SYSTEM_ERROR
                                })
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }

        return user
    }

    async login(email: string, password: string) {
        const user = await User.findOne({where: { email: email }});
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }
        console.log(password, user.password)
        const validPassword = await bcrypt.compare(password, user.password)
        if (validPassword) {
            const payload: JwtPayload = {
                email: user.email,
                displayName: user.displayName
            }
            
            const token = jwt.sign(payload, this._jwtSecret, {
                expiresIn: this._jwtExpiresIn
            })
            
            return {
                email: user.email,
                accessToken: token,
                displayName: user.displayName,
                expiresIn: 12222 //TODO: research
            }
        }
        else {
            throw (ResponseCode.LOGIN_INVALID)
        }
    }

    async verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this._jwtSecret, (err, decoded) => {
                if (err) {
                    resolve(false)
                    return
                }
                console.log('true')
                resolve(true)
                return
            })
        }) as Promise<boolean>
    }

    private buildDto(user: UserModel) {
        return {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            githubUsername: user.githubUsername,
            location: user.location,
            title: user.title,
            twitterUsername: user.twitterUsername,
            websiteLink: user.websiteLink
        }
    }
}

export default UserService.getInstance()
