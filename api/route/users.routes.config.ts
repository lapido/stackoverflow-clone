import CommonRoutesConfig from './common.routes.config';
import UserController from '../controller/user.controller';
import UserValidation from '../middleware/user.validation';
import express from 'express';

export default class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes() {
        this.app.post('/user/register', UserValidation['forUserDto'], UserController.registerUser);
        this.app.post('/login', UserValidation['forLogin'], UserController.login);
        this.app.post('/user/:id', UserValidation['forUserDto'], UserController.updateUser);
        // this.app.route(`/users`)
        //     .get(UsersController.listUsers)
        //     .post(
        //         UsersMiddleware.validateRequiredUserBodyFields,
        //         UsersMiddleware.validateSameEmailDoesntExist,
        //         UsersController.createUser);

        // this.app.param(`userId`, UsersMiddleware.extractUserId);
        // this.app.route(`/users/:userId`)
        //     .all(UsersMiddleware.validateUserExists)
        //     .get(UsersController.getUserById)
        //     .delete(UsersController.removeUser);

        // this.app.put(`/users/:userId`,[
        //     UsersMiddleware.validateRequiredUserBodyFields,
        //     UsersMiddleware.validateSameEmailBelongToSameUser,
        //     UsersController.put
        // ]);

        // this.app.patch(`/users/:userId`, [
        //     UsersMiddleware.validatePatchEmail,
        //     UsersController.patch
        // ]);

        return this.app;
    }
}