import { check } from 'express-validator'

const QuestionValidation = {
    forQuestionDto: [
        check('userId')
            .exists().withMessage('userId cannot be empty'),
        check('title')
            .exists().withMessage('title cannot be empty'),
        check('body')
            .exists().withMessage('body cannot be empty')
    ]
}

export default QuestionValidation;