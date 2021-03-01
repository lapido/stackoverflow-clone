import { QuestionDto } from "../dto/question.dto"
import { Question } from '../model/question.model'
import debug from 'debug';
import ResponseCode from "../enum/response.code";
import { User } from "../model/user.model";
import { getPagination, getPagingData } from "./util/pagination.util";

const log: debug.IDebugger = debug('app:question-service');

class QuestionService {

    private static instance: QuestionService

    static getInstance(): QuestionService {
        if (!QuestionService.instance) {
            QuestionService.instance = new QuestionService()
        }
        return QuestionService.instance
    }

    async createQuestion (userId:number ,questionDto: QuestionDto) {
        if (userId === null || userId <= 0) {
            return ResponseCode.BAD_REQUEST
        }

        const user = await User.findByPk(userId)
                                .catch (e => {
                                    log('Error: ',e)
                                    return ResponseCode.SYSTEM_ERROR
                                })
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }

        return Question.create({
            userId: userId,
            title: questionDto.title,
            body: questionDto.body
        })
        .catch (e => {
            log('Error: ',e)
            return ResponseCode.SYSTEM_ERROR
        })
    }

    async getQuestionsByUser (userId: number, page: number, size: number) {
        if (userId === null || userId <= 0 || page <= 0 || size <= 0) {
            return ResponseCode.BAD_REQUEST
        }

        const user = await User.findByPk(userId)
            .catch (e => {
                return ResponseCode.SYSTEM_ERROR
            })
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }

        const { limit, offset} = getPagination(page, size)

        return Question.findAndCountAll( {limit: limit,
            offset: offset, where: {userId: userId}} )
            .then (data => {
                const response = getPagingData(data, page, limit)

                return response
            })
            .catch (e => {
                log('Error: ',e)
                return ResponseCode.SYSTEM_ERROR
            })
    }

    async getQuestions(page: number, size: number) {
        if (page <= 0 || size <= 0) {
            return ResponseCode.BAD_REQUEST
        }

        const { limit, offset} = getPagination(page, size)

        return Question.findAndCountAll( {limit: limit, offset: offset} )
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


export default QuestionService.getInstance()