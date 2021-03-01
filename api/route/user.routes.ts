import CommonRoutesConfig from './common.routes.config';
import UserController from '../controller/user.controller';
import UserValidation from '../validation/user.validation';
import express from 'express';

export default class UserRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ProtectedUserRoutes');
    }

    configureRoutes() {
        this.app.put('/v1/users/:id', UserValidation['forUserDto'], UserController.updateUser);
        this.app.get('/v1/users/:id', UserController.getUserById)
        this.app.get('/v1/users/email', UserController.getUserByEmail)
        
        return this.app;
    }
}