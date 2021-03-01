import CommonRoutesConfig from './common.routes.config';
import express from 'express';
import AnswerValidation from '../validation/answer.validation';
import AnswerController from '../controller/answer.controller';

export default class AnswerRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AnswerRoutes')
    }

    configureRoutes() {
        this.app.post('/v1/questions/:questionId/answers', AnswerValidation['forAnswerDto'], AnswerController.answerQuestion)
        this.app.get('/v1/questions/:questionId/answers', AnswerController.getAnswersByQuestion)
        
        return this.app
    }
}