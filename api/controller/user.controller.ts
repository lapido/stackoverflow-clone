import ResponseCode from '../enum/response.code';
import express from 'express';
import UserService from '../service/user.service';
import { validationResult } from 'express-validator/check'
import debug from 'debug'

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

    async getUserByEmail(req: express.Request, res: express.Response) {
        const email = req.query.address as string

        return UserService.getUserByEmail(email)
                            .then(u => res.json(u))
    }

    async getUserById(req: express.Request, res: express.Response) {
        const userId = +req.params.id

        return UserService.getUserById(userId)
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
}

export default UsersController.getInstance();