import ResponseCode from '../enum/response.code';
import express from 'express';
import UserService from '../service/user.service';
import { validationResult } from 'express-validator/check'
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
    private static instance: UsersController;

    // this will be a controller singleton (same pattern as before)
    static getInstance(): UsersController {
        if (!UsersController.instance) {
            UsersController.instance = new UsersController();
        }
        return UsersController.instance;
    }

    async registerUser(req: express.Request, res: express.Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({'error': errors.array()})
        }

        const user = UserService.register(req.body)
        return user
                .then(u => res.json(u));
    }

    async updateUser(req: express.Request, res: express.Response) {
        const id: number = +req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({'error': errors.array()})
        }

        return UserService.update(id, req.body)
                            .then(u => res.json(u))
        
    }

    async login(req: express.Request, res: express.Response) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({'error': errors.array()})
        }

        const loginStatus = UserService.login(req.body.email, req.body.password);
        return loginStatus
                    .then(t => res.json(t));
    }

    // async listUsers(req: express.Request, res: express.Response) {
    //     const users = await usersService.list(100, 0);
    //     res.status(200).send(users);
    // }

    // async getUserById(req: express.Request, res: express.Response) {
    //     const user = await usersService.readById(req.params.userId);
    //     res.status(200).send(user);
    // }

    // async createUser(req: express.Request, res: express.Response) {
    //     req.body.password = await argon2.hash(req.body.password);
    //     const userId = await usersService.create(req.body);
    //     res.status(201).send({id: userId});
    // }

    // async patch(req: express.Request, res: express.Response) {
    //     if(req.body.password){
    //         req.body.password = await argon2.hash(req.body.password);
    //     }
    //     log(await usersService.patchById(req.body));
    //     res.status(204).send(``);
    // }

    // async put(req: express.Request, res: express.Response) {
    //     req.body.password = await argon2.hash(req.body.password);
    //     log(await usersService.updateById({id: req.params.userId, ...req.body}));
    //     res.status(204).send(``);
    // }

    // async removeUser(req: express.Request, res: express.Response) {
    //     log(await usersService.deleteById(req.params.userId));
    //     res.status(204).send(``);
    // }
}

export default UsersController.getInstance();