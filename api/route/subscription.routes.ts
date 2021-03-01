import CommonRoutesConfig from './common.routes.config';
import express from 'express';
import subscriptionController from '../controller/subscription.controller';


export default class SubscriptionRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SubscriptionRoutes')
    }

    configureRoutes() {
        this.app.post('/v1/questions/:questionId/subscribe', subscriptionController.subscribe)
        this.app.post('/v1/questions/:questionId/unsubscribe', subscriptionController.unsubscribe)
        
        return this.app
    }
}