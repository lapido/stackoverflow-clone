import {UserDto} from "../dto/user.dto";
import * as bcrypt from 'bcrypt'
import {User, UserModel} from '../model/user.model'
import * as jwt from 'jsonwebtoken'
import debug from 'debug';
import ResponseCode from '../enum/response.code'
import JwtPayload from "./interface/jwt.payload";
import ConfigProperty from "../../config/env.config";

/*
   The UserService exposes methods that effect changes on the user model,
   and also includes method to login a user and fetch a user by both id and email
*/
const log: debug.IDebugger = debug('app:users-service');

class UserService {
    private readonly _saltRounds = +ConfigProperty.SaltRound
    private readonly _jwtSecret = ConfigProperty.JwtSecret
    private readonly _jwtExpiresIn = ConfigProperty.JwtExpiresIn
    private static instance: UserService;

    /*
        the getInstance ensures that only one instance of UserServicce
        would persist in the memory during the application's life cycle
        by restricts instantiation of this class to just one object.
    */
    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    /**
         * Creates a new user
         *
         * @param UserDto - has the user information to be stored
         * @returns a user object if operation is successful, while
         * it returns an error response object if operation fails
         *
     */
    async register(userDto: UserDto) {
        const user = await User.findOne({where: {email: userDto.email}})
        if (user != null) {
            return ResponseCode.USER_ALREADY_EXISTS
        }

        //password is hashed using bcrypt
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

     /**
         * Updates user information
         *
         * @param UserDto - has the user information to be stored
         * @param id - userId to be updated
         * @returns a user object if operation is successful, while
         * it returns an error response object if operation fails
         *
     */
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
                return ResponseCode.UPDATE_FAILED
            })
            .catch(err => {
                log('Error: ', err)
                return ResponseCode.SYSTEM_ERROR
            })

    }


    /**
     * Finds and returns a user model
     *
     * @param id - id of user to find and return
     * @returns a user object if operation is successful, while
     * it returns an error response object if operation fails
     *
    */
    async getUserById(id: number) {
        const user = await User.findByPk(id)
                                .then (data => {
                                    if (data) {
                                        return this.buildDto(data)
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

     /**
         * Find and returns a user model
         *
         * @param email - email of the user to find and return
         * @returns a user object if operation is successful, while
         * it returns an error response object if operation fails
         *
     */
    async getUserByEmail(email: string) {
        const user = await User.findOne({ where: {email: email}})
                                .then (data => {
                                    if (data) {
                                        return this.buildDto(data)
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


     /**
         * Authenticate a user
         *
         * @param email - valid email of the user to be authenticated
         * @param password - plain password of the user to be authenticated
         * @returns a jwt token with the user's displayname and email
         *
     */
    async login(email: string, password: string) {
        const user = await User.findOne({where: { email: email }})
        
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }
        
        const validPassword = await bcrypt.compare(password, user.password)
        if (validPassword) {
            const payload: JwtPayload = {
                email: user.email,
                displayName: user.displayName
            }
            
            const token = this.generateToken(payload)
            
            return {
                email: user.email,
                accessToken: token,
                displayName: user.displayName
            }
        }
        else {
            return ResponseCode.LOGIN_INVALID
        }
    }

    /**
     * Generates a jwt token
     *
     * @param JwtPayload - has the user information to be stored in the token
     * @returns a signed token
     *
    */
    generateToken(payload: JwtPayload) {
        return jwt.sign(payload, this._jwtSecret, {
            expiresIn: this._jwtExpiresIn
        })
    }

    /**
     * Verifies a jwt token
     *
     * @param token - token to be verified
     * @returns a boolean: true - token is valid, or false - token is invalid
     *
    */
    async verifyToken(token: string) {
        return new Promise((resolve, reject) => {
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

    buildDto(user: UserModel) {
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
