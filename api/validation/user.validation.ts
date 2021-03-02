import { check } from 'express-validator/check'


const UserValidation = {
    forUserDto: [
        check('displayName')
            .exists().withMessage('displayName cannot be empty')
            .isString()
            .not().isEmpty(),
        check('firstName')
            .exists().withMessage('firstName cannot be empty')
            .isString()
            .not().isEmpty(),
        check('lastName')
            .exists().withMessage('lastName cannot be empty')
            .isString()
            .not().isEmpty(),
        check('email')
            .exists().withMessage('email cannot be empty')
            .isEmail().withMessage('Invalid email format'),
        check('password')
            .exists().withMessage('password cannot be empty')
            .isString()
            .not().isEmpty()
            .isLength({min: 8}).withMessage('Invalid password - minimum of 8 characters'),
        check('confirmPassword')
            .exists().withMessage('confirmPassword cannot be empty')
            .custom((confirmPassword, {req}) =>  req.body.password === confirmPassword).withMessage('Passwords are different')
    ],
    forUserUpdate: [
        check('displayName')
            .exists().withMessage('displayName cannot be empty')
            .isString()
            .not().isEmpty(),
        check('firstName')
            .exists().withMessage('firstName cannot be empty')
            .isString()
            .not().isEmpty(),
        check('lastName')
            .exists().withMessage('lastName cannot be empty')
            .isString()
            .not().isEmpty(),
        check('email')
            .exists().withMessage('email cannot be empty')
            .isEmail().withMessage('Invalid email format')
            .isString()
            .not().isEmpty(),
        check('title')
            .exists().withMessage('title cannot be empty'),
        check('location')
            .exists().withMessage('location cannot be empty'),
        check('githubUsername')
            .exists().withMessage('githubUsername cannot be empty'),
        check('twitterUsername')
            .exists().withMessage('twitterUsername cannot be empty'),
        check('websiteLink')
            .exists().withMessage('websiteLink cannot be empty')

    ],
    forLogin: [
      check('email')
        .exists().withMessage('email field cannot be empty')
        .isEmail().withMessage('Invalid email format'),
      check('password')
        .exists().withMessage('password field cannot be empty')
        
    ]
}

export default UserValidation;