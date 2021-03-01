import { AnswerDto } from "../dto/answer.dto"
import ResponseCode from "../enum/response.code"
import { User } from "../model/user.model"
import debug from 'debug';
import { Question } from "../model/question.model";
import { Answer } from "../model/answer.model";
import { getPagination, getPagingData } from "./util/pagination.util";
import { Subscription } from "../model/subscription.model";
import { SubscriptionStatus } from "../enum/subscription.status";
import SubscriptionService from "./subscription.service";

const log: debug.IDebugger = debug('app:answer-service');

class AnswerService {
    private static instance: AnswerService

    static getInstance(): AnswerService {
        if (!AnswerService.instance) {
            AnswerService.instance = new AnswerService()
        }
        return AnswerService.instance
    }

    async createAnswer(questionId: number, answerDto: AnswerDto) {
        if (questionId === null || questionId <= 0){
            return ResponseCode.BAD_REQUEST
        }

        const user = await User.findByPk(answerDto.userId)
                                .catch (e => {
                                    log('Error: ',e)
                                    return ResponseCode.SYSTEM_ERROR
                                })
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }

        const question = await Question.findByPk(questionId)
                                        .catch(e => {
                                            log('Error: ', e)
                                            return ResponseCode.SYSTEM_ERROR
                                        })
        if (question == null) {
            return ResponseCode.QUESTION_DOES_NOT_EXISTS
        }

        return Answer.create({
            userId: answerDto.userId,
            questionId: questionId,
            body: answerDto.body
        })
        .then(data => {
            SubscriptionService.notify(questionId)
            Subscription.findAll({ include: User, where: {questionId: questionId, status: SubscriptionStatus.ACTIVATED} })
                .then(subData => {
                    subData.forEach (async (d) => {
                        d.
                    })
                    
                })

            return data

        })
        // .catch(e => {
        //     log('Error: ', e)
        //     return ResponseCode.SYSTEM_ERROR
        // })
    }

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