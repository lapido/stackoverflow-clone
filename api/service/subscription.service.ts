import ResponseCode from "../enum/response.code"
import { Question } from "../model/question.model"
import { User } from "../model/user.model"
import debug from 'debug';
import { Subscription } from "../model/subscription.model";
import EmailService from "./email.service";

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

    //gets all users who have subscribed to the question
    async getAllUsersSubscribedForAQuestion(questionId: number) {
        const usersEmail: string[] = []
        return await Subscription.findAll({where: {questionId: questionId}})
            .then(rows => {
                rows.forEach(async function(row) {
                    const userId = row.userId
                    const user = await User.findByPk(userId)
                    if (user) {
                        usersEmail.push(user?.email)
                    }
                })
                return usersEmail;
            })
            .catch(e => {
                log('Error: ', e)
                throw e
            })
    }

    //sends out notification to users who have subscribed
    async notify(questionId: number){
        const usersEmails = await this.getAllUsersSubscribedForAQuestion(questionId)
        return await usersEmails.forEach(async function(email) {
            const to = email
            const subject = 'Stackoverflow - Notification'
            const body = 'The question you subscribed for has been answered'
            await EmailService.sendMail(to, subject, body)
        })
    }
}

export default SubscriptionService.getInstance()