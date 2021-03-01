import express from 'express'
import { validationResult } from 'express-validator'
import debug from 'debug';
import QuestionService from '../service/question.service'

const log: debug.IDebugger = debug('app:question-controller');

class QuestionController {
    private static instance: QuestionController;

    static getInstance(): QuestionController {
        if (!QuestionController.instance) {
            QuestionController.instance = new QuestionController()
        }

        return QuestionController.instance
    }

    async askQuestion(req: express.Request, res: express.Response) {
        const userId: number = +req.params.userId
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({'error': errors.array()})
        }

        return QuestionService.createQuestion(userId, req.body)
                                .then(u => res.json(u))
    }

    async getQuestionsByUser(req: express.Request, res: express.Response) {
        const size: number = +(req.query.size as string)
        const page: number = +(req.query.page as string)
        const userId: number = +req.params.userId

        return QuestionService.getQuestionsByUser(userId, page, size)
                    .then(u => res.json(u))
    }

    async getQuestions(req: express.Request, res: express.Response) {
        const size: number = +(req.query.size as string)
        const page: number = +(req.query.page as string)

        return QuestionService.getQuestions(page, size)
                    .then(u => res.json(u))
    }
}

export default QuestionController.getInstance()