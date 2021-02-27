import CommonRoutesConfig from './common.routes.config';
import UserController from '../controller/user.controller';
import UserValidation from '../middleware/user.validation';
import express from 'express';

export default class ProtectedUsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ProtectedUserRoutes');
    }

    configureRoutes() {
        this.app.put('/user/:id', UserValidation['forUserDto'], UserController.updateUser);
        
        return this.app;
    }
}