const ResponseCode = Object.freeze({
    USER_ALREADY_EXISTS: { message: 'USER_ALREADY_EXISTS', code: 409 },
    USER_DOES_NOT_EXISTS: { message: 'USER_DOES_NOT_EXISTS', code: 404 },
    SYSTEM_ERROR: { message: 'SYSTEM_ERROR', code: 500},
    LOGIN_INVALID: { message: 'LOGIN_INVALID', code: 401 },
    USER_RECORD_UPDATED: {message: 'USER_RECORD_UPDATED', code: 200},
    UPDATE_FAILED: { message: 'UPDATE_FAILED', code: 500 },
    BAD_REQUEST: { message:'BAD_REQUEST', code: 400 },
    QUESTION_DOES_NOT_EXISTS: { message: 'QUESTION_DOES_NOT_EXISTS', code: 404},
    ANSWER_DOES_NOT_EXISTS: { message: 'ANSWER_DOES_NOT_EXISTS', code: 404}
})

export default ResponseCode