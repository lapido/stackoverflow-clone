import debug from 'debug';
import sequelize from 'sequelize';
import { VoteDto } from '../dto/vote.dto';
import ResponseCode from '../enum/response.code';
import { Answer } from '../model/answer.model';
import { User } from '../model/user.model';
import { Vote } from '../model/vote.model';

const log: debug.IDebugger = debug('app:vote-service');

class VoteService {
    private static instance: VoteService

    static getInstance(): VoteService {
        if (!VoteService.instance) {
            VoteService.instance = new VoteService()
        }

        return VoteService.instance
    }

    async vote(answerId: number, voteDto: VoteDto) {
        if (answerId === null || answerId <= 0){
            return ResponseCode.BAD_REQUEST
        }

        const user = await User.findByPk(voteDto.userId)
                                .catch (e => {
                                    log('Error: ',e)
                                    return ResponseCode.SYSTEM_ERROR
                                })
        if (user == null) {
            return ResponseCode.USER_DOES_NOT_EXISTS
        }

        const answer = await Answer.findByPk(answerId)
                                    .catch (e => {
                                        log('Error: ', e)
                                        return ResponseCode.SYSTEM_ERROR
                                    })
        if (answer == null) {
            return ResponseCode.ANSWER_DOES_NOT_EXISTS
        }

        const vote = await Vote.findOne({where: {userId: voteDto.userId, answerId: answerId}})
            .catch(e => {
                log('Error: ', e)
                return ResponseCode.SYSTEM_ERROR
            })

        if (vote == null) {
            return Vote.create({
                userId: voteDto.userId,
                answerId: answerId,
                voteType: voteDto.voteType
            })
            .then(data => {
                return { message: "Vote recorded", code: 200}
            })
            .catch(e => {
                log('Error: ', e)
                return ResponseCode.SYSTEM_ERROR
            })
        }

        return Vote.update({voteType: voteDto.voteType}, {where: {userId: voteDto.userId, answerId: answerId}})
            .then(data => {
                return { message: "User vote updated", code: 200}
            })
            .catch(e => {
                log('Error: ', e)
                return ResponseCode.SYSTEM_ERROR
            })

    }

    async getVotesByAnswer(answerId: number) {
        const answer = await Answer.findByPk(answerId)
        .catch (e => {
            log('Error: ', e)
            return ResponseCode.SYSTEM_ERROR
        })
        if (answer == null) {
            return ResponseCode.ANSWER_DOES_NOT_EXISTS
        }

        return Vote.findAll({
            attributes: ['vote_type', [sequelize.fn('count', sequelize.col('id')), 'count']],
            where: { answerId: answerId },
            group : ['Vote.vote_type'],
            raw: true,
            order: sequelize.literal('count DESC')
        })
        .then(data => {
            return data
        })
        .catch(e => {
            log('Error: ', e)
            return ResponseCode.SYSTEM_ERROR
        })
    }
}

export default VoteService.getInstance()