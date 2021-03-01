import express from 'express'
import debug from 'debug';
import SubscriptionService from '../service/subscription.service';
import { SubscriptionStatus } from '../enum/subscription.status';

const log: debug.IDebugger = debug('app:subscription-controller');

class SubscriptionController {
    private static instance: SubscriptionController

    static getInstance(): SubscriptionController {
        if (!SubscriptionController.instance) {
            SubscriptionController.instance = new SubscriptionController()
        }

        return SubscriptionController.instance
    }

    async subscribe(req: express.Request, res: express.Response) {
        const userId: number = +req.body.userId
        const questionId: number = +req.params.questionId

        return SubscriptionService.subscribe(userId, questionId, SubscriptionStatus[SubscriptionStatus.ACTIVATED])
            .then(u => res.json(u))
    }

    async unsubscribe(req: express.Request, res: express.Response) {
        const userId: number = +req.body.userId
        const questionId: number = +req.params.questionId

        return SubscriptionService.subscribe(userId, questionId, SubscriptionStatus[SubscriptionStatus.DEACTIVATED])
            .then(u => res.json(u))
    }
}

export default SubscriptionController.getInstance()