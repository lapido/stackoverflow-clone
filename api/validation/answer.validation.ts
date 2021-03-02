import { check } from 'express-validator'

//Client's input is validated before hitting the controller layer
const AnswerValidation = {
    forAnswerDto: [
        check('body')
            .exists().withMessage('body cannot be empty'),
        check('userId')
            .exists().withMessage('userId cannot be empty')
            .isInt({min: 1}).withMessage('Incorrect type or value for userId')
    ]
}

export default AnswerValidation;