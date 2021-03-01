import express from 'express'
import { validationResult } from 'express-validator'
import debug from 'debug';
import AnswerService from '../service/answer.service';

const log: debug.IDebugger = debug('app:answer-controller');

class AnswerController {
    private static instance: AnswerController

    static getInstance(): AnswerController {
        if (!AnswerController.instance) {
            AnswerController.instance = new AnswerController()
        }

        return AnswerController.instance
    }

    async answerQuestion(req: express.Request, res: express.Response) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({'error': errors.array()})
        }
        const questionId: number = +req.params.questionId

        return AnswerService.createAnswer(questionId, req.body)
                                .then(u => res.json(u))
    }

    async getAnswersByQuestion(req: express.Request, res: express.Response) {
        const questionId: number = +req.params.questionId
        const size: number = +(req.query.size as string)
        const page: number = +(req.query.page as string)

        return AnswerService.getAnswersByQuestion(questionId, page, size)
                                .then(u => res.json(u))
    }
}

export default AnswerController.getInstance()