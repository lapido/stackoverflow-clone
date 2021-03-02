import { AnswerDto } from "../dto/answer.dto"
import ResponseCode from "../enum/response.code"
import { User } from "../model/user.model"
import debug from 'debug';
import { Question } from "../model/question.model";
import { Answer } from "../model/answer.model";
import { getPagination, getPagingData } from "./util/pagination.util";

const log: debug.IDebugger = debug('app:answer-service');

/*
    AnswerService centralizes the data access by making it reachable by the controller;
   it also defines the business logic
*/
class AnswerService {
    private static instance: AnswerService

    static getInstance(): AnswerService {
        if (!AnswerService.instance) {
            AnswerService.instance = new AnswerService()
        }
        return AnswerService.instance
    }


    
    /**
     * Creates a new answer or updates an existing created answer from the same user for the same question
     *
     * @param questionId - questionId
     * @param answerDto - has the Answer information to be stored
     * @returns a response stating if the operation was successful or not
     *
    */
    async createAnswer(questionId: number, answerDto: AnswerDto) {
        if (questionId === null || questionId <= 0){
            return ResponseCode.BAD_REQUEST
        }

        //validating if the user exist
        const user = await User.findByPk(answerDto.userId)
                                .catch (e => {
                                    log('Error: ',e)
                                    return ResponseCode.SYSTEM_ERROR
                                })
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }

        //validating if the question exist
        const question = await Question.findByPk(questionId)
                                        .catch(e => {
                                            log('Error: ', e)
                                            return ResponseCode.SYSTEM_ERROR
                                        })
        if (question == null) {
            return ResponseCode.QUESTION_DOES_NOT_EXISTS
        }

        //validating if the user as once submitted an answer for the question
        //if yes, an update is done.
        const answer = await Answer.findOne({where: {userId: answerDto.userId, questionId: questionId}})
                .catch(e => {
                    log('Error: ', e)
                    return ResponseCode.SYSTEM_ERROR
                })
        if (answer == null) {
            return Answer.create({
                userId: answerDto.userId,
                questionId: questionId,
                body: answerDto.body
            })
            .catch(e => {
                log('Error: ', e)
                return ResponseCode.SYSTEM_ERROR
            })
        }

        return Answer.update({body: answerDto.body}, 
            {where: {userId: answerDto.userId, questionId: questionId}})
            .then(data => {
                if (data[0] === 1) {
                    return { message: "User answered updated", code: 200}
                }
                return ResponseCode.UPDATE_FAILED
            })
            .catch (e => {
                log('Error: ', e)
                return ResponseCode.SYSTEM_ERROR
            })
    }


    /**
     * Gets All answers for a particular question
     *
     * @param questionId - questionId
     * @param page - page number for pagination
     * @param size - page size for pagination
     * @returns paginated answers
     *
    */
    async getAnswersByQuestion (questionId: number, page: number, size: number) {
        if (questionId === null || questionId <= 0 || page <= 0 || size <= 0) {
            return ResponseCode.BAD_REQUEST
        }

        const question = await Question.findByPk(questionId)
                .catch(e => {
                    log('Error: ', e)
                    return ResponseCode.SYSTEM_ERROR
                })
        if (question == null) {
            return ResponseCode.QUESTION_DOES_NOT_EXISTS
        }

        const { limit, offset} = getPagination(page, size)

        return Answer.findAndCountAll( {limit: limit,
            offset: offset, where: {questionId: questionId}} )
            .then (data => {
                const response = getPagingData(data, page, limit)

                return response
            })
            .catch (e => {
                log('Error: ',e)
                return ResponseCode.SYSTEM_ERROR
            })
    }



}


export default AnswerService.getInstance()