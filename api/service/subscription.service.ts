import ResponseCode from "../enum/response.code"
import { Question } from "../model/question.model"
import { User } from "../model/user.model"
import questionService from "./question.service"

import debug from 'debug';
import { Subscription } from "../model/subscription.model";
const log: debug.IDebugger = debug('app:subscription-service');

class SubscriptionService {
    private static instance: SubscriptionService

    static getInstance(): SubscriptionService {
        if (!SubscriptionService.instance) {
            SubscriptionService.instance = new SubscriptionService()
        }

        return SubscriptionService.instance
    }

    async subscribe(userId: number, questionId: number, status: string) {
        if (userId === null || userId <= 0 || questionId === null || questionId <= 0) {
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

        const question = await Question.findByPk(questionId)
                                        .catch(e => {
                                            log('Error: ', e)
                                            return ResponseCode.SYSTEM_ERROR
                                        })
        if (question == null) {
            return ResponseCode.QUESTION_DOES_NOT_EXISTS
        }
        
        const subscription = await Subscription.findOne({where: { userId: userId, questionId: questionId }})
                        .catch(e => {
                            log('Error: ', e)
                            return ResponseCode.SYSTEM_ERROR
                        })
        if (subscription == null){
            return Subscription.create({
                    userId: userId,
                    questionId: questionId,
                    status: status
                }
            )
            .then( data => {
                return { message: 'Subscription updated for user', code: 200}
            })
            .catch(e => {
                log('Error: ', e)
                return ResponseCode.SYSTEM_ERROR
            })
        }

        return Subscription.update({status: status}, { where: {
            userId: userId, questionId: questionId
        }})
        .then(data => {
            return { message: 'Subscription updated for user', code: 200}
        })
        .catch(e => {
            log('Error: ', e)
            return ResponseCode.SYSTEM_ERROR
        })
    }

    async notify(questionId: number){

    }
}

export default SubscriptionService.getInstance()