import CommonRoutesConfig from './common.routes.config';
import UserController from '../controller/user.controller';
import UserValidation from '../validation/user.validation';
import express from 'express';

export default class UnprotectedUserRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes() {
        this.app.post('/v1/users', UserValidation['forUserDto'], UserController.registerUser);
        this.app.post('/v1/login', UserValidation['forLogin'], UserController.login);
        return this.app;
    }
}