import express from 'express'
import { validationResult } from 'express-validator'
import debug from 'debug';
import VoteService from '../service/vote.service';

const log: debug.IDebugger = debug('app:vote-controller');
class VoteController {
    private static instance: VoteController

    static getInstance(): VoteController {
        if (!VoteController.instance) {
            VoteController.instance = new VoteController()
        }

        return VoteController.instance
    }

    async vote(req: express.Request, res: express.Response) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({'error': errors.array()})
        }
        const answerId: number = +req.params.answerId

        return VoteService.vote(answerId, req.body)
                            .then(u => res.json(u))
    }

    async getVotesbyAnswer(req: express.Request, res: express.Response) {
        const answerId: number = +req.params.answerId
        return VoteService.getVotesByAnswer(answerId)
                            .then(u => res.json(u))
    }
}

export default VoteController.getInstance()