import { check } from 'express-validator/check'


const UserValidation = {
    forUserDto: [
        check('displayName')
            .exists().withMessage('displayName cannot be empty'),
        check('firstName')
            .exists().withMessage('firstName cannot be empty'),
        check('lastName')
            .exists().withMessage('lastName cannot be empty'),
        check('email')
            .exists().withMessage('email cannot be empty')
            .isEmail().withMessage('Invalid email format'),
        check('password')
            .exists().withMessage('password cannot be empty')
            .isLength({min: 8}).withMessage('Invalid password - minimum of 8 characters'),
        check('confirmPassword')
            .exists().withMessage('confirmPassword cannot be empty')
            .custom((confirmPassword, {req}) =>  req.body.password === confirmPassword).withMessage('Passwords are different')
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