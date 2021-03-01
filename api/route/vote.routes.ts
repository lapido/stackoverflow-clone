import CommonRoutesConfig from "./common.routes.config";

import express from 'express';
import VoteController from "../controller/vote.controller";
import VoteValidation from "../validation/vote.validation";

export default class VoteRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'VoteRoutes')
    }

    configureRoutes() {
        this.app.post('/v1/answers/:answerId/votes', VoteValidation['forVoteDto'], VoteController.vote)
        this.app.get('/v1/answers/:answerId/votes', VoteController.getVotesbyAnswer)

        return this.app
    }
}