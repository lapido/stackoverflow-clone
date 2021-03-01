import { check } from 'express-validator'
import { VoteType } from '../enum/vote.type';

const VoteValidation = {
    forVoteDto: [
        check('voteType')
            .isIn(Object.values(VoteType)),
        check('userId')
            .exists().withMessage('userId cannot be empty')
            .isInt({min: 1}).withMessage('Incorrect type or value for userId')
    ]
}

export default VoteValidation;