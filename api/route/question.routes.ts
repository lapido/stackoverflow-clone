import CommonRoutesConfig from './common.routes.config';
import QuestionController from '../controller/question.controller';
import QuestionValidation from '../validation/question.validation';
import express from 'express';

export default class QuestionRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'QuestionRoutes')
    }

    configureRoutes() {
        this.app.post('/v1/users/:userId/questions', QuestionValidation['forQuestionDto'], QuestionController.askQuestion)
        this.app.get('/v1/users/:userId/questions', QuestionController.getQuestionsByUser)
        this.app.get('/v1/questions', QuestionController.getQuestions)
        return this.app
    }
}