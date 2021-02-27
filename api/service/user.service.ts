import {UserDto} from "../dto/user.dto";
import * as bcrypt from 'bcrypt'
import {User} from '../model/user.model'
import * as jwt from 'jsonwebtoken'
import debug from 'debug';
import ResponseCode from '../enum/response.code'
import JwtPayload from "./interface/jwt.payload";
import ConfigProperty from "../../config/env.config";

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
            })
            .catch(e => {
                log('Error: ', e)
                return ResponseCode.SYSTEM_ERROR
            })
    }

    async update(id: number, userDto: UserDto) {
        const user = await User.findByPk(id)
                            .then(user => {
                                return user;
                            })
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
        const user = await User.findByPk(id);
        //TODO:throw some exceptions
        if (user == null) {
            log('User not found')
        }

        return user;
    }

    async getUserByEmail(email: string) {
        const user = await User.findOne({ where: {email: email}})
        if (user == null) {
            throw (ResponseCode.USER_DOES_NOT_EXISTS)
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
            // this.getUserByEmail(payload.email)
            jwt.verify(token, this._jwtSecret, (err, decoded) => {
                if (err) {
                    resolve(false)
                    return
                }

                resolve(true)
                return
            })
        }) as Promise<boolean>
    }
}

export default UserService.getInstance()
