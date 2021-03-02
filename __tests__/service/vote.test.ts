import { VoteDto } from "../../api/dto/vote.dto"
import faker from 'faker'
import { VoteType } from "../../api/enum/vote.type"
import { User } from "../../api/model/user.model"
import { Answer } from "../../api/model/answer.model"
import { Vote } from "../../api/model/vote.model"
import VoteService from "../../api/service/vote.service"

jest.mock('../../api/model/vote.model')

test('test user vote', async() => {
    const answerId: number = faker.random.number()
    const userId: number = faker.random.number()
    const voteDto: VoteDto = {
        userId: userId,
        voteType: VoteType.DOWNVOTE,
        answerId: answerId
    }

    const user: any = {id: userId}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)
    
    const answer: any = {id: answerId}
    const answerModel = new Promise<any>((resolve, reject) => {
        resolve(answerModel);
      });
    jest.spyOn(Answer, 'findByPk').mockResolvedValueOnce(answerModel)
    
    jest.spyOn(Vote, 'findOne').mockResolvedValueOnce(null)

    await VoteService.vote(answerId, voteDto)
    expect(Vote.findOne).toHaveBeenCalledTimes(1)
    expect(Vote.create).toHaveBeenCalledTimes(1)
    expect(Vote.update).toHaveBeenCalledTimes(0)
})

test('test user vote when user does not exist', async() => {
    const answerId: number = faker.random.number()
    const userId: number = faker.random.number()
    const voteDto: VoteDto = {
        userId: userId,
        voteType: VoteType.DOWNVOTE,
        answerId: answerId
    }

    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null)
    await VoteService.vote(answerId, voteDto)
    expect(Vote.findOne).toHaveBeenCalledTimes(0)
    expect(Vote.create).toHaveBeenCalledTimes(0)
    expect(Vote.update).toHaveBeenCalledTimes(0)
})

test('test user vote when answer does not exist', async() => {
    const answerId: number = faker.random.number()
    const userId: number = faker.random.number()
    const voteDto: VoteDto = {
        userId: userId,
        voteType: VoteType.DOWNVOTE,
        answerId: answerId
    }

    const user: any = {id: userId}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)
    jest.spyOn(Answer, 'findByPk').mockResolvedValueOnce(null)
    
    await VoteService.vote(answerId, voteDto)
    expect(Vote.findOne).toHaveBeenCalledTimes(0)
    expect(Vote.create).toHaveBeenCalledTimes(0)
    expect(Vote.update).toHaveBeenCalledTimes(0)
})

test('test update vote', async() => {
    const answerId: number = faker.random.number()
    const userId: number = faker.random.number()
    const voteDto: VoteDto = {
        userId: userId,
        voteType: VoteType.DOWNVOTE,
        answerId: answerId
    }

    const user: any = {id: userId}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)
    
    const answer: any = {id: answerId}
    const answerModel = new Promise<any>((resolve, reject) => {
        resolve(answer);
      });
    jest.spyOn(Answer, 'findByPk').mockResolvedValueOnce(answerModel)

    const vote: any = {id: faker.random.number()}
    const VoteModel = new Promise<any>((resolve, reject) => {
        resolve(vote);
      });
    jest.spyOn(Vote, 'findOne').mockResolvedValueOnce(VoteModel)

    const updateStatus: number = 1
    const updateRes: any = [updateStatus, vote]
    const updateModel = new Promise<any>((resolve, reject) => {
        resolve(updateRes);
      });
    jest.spyOn(Vote, 'update').mockResolvedValueOnce(updateModel)  

    await VoteService.vote(answerId, voteDto)
    expect(Vote.findOne).toHaveBeenCalledTimes(1)
    expect(Vote.create).toHaveBeenCalledTimes(0)
    expect(Vote.update).toHaveBeenCalledTimes(1)
})


test('test get votes by answer', async() => {
    const answerId = faker.random.number()

    const answer: any = {id: answerId}
    const answerModel = new Promise<any>((resolve, reject) => {
        resolve(answer);
      });
    jest.spyOn(Answer, 'findByPk').mockResolvedValueOnce(answerModel)

    const resultData: any = {}
    const resultModel = new Promise<any>((resolve, reject) => {
        resolve(resultData);
      });
    jest.spyOn(Vote, 'findAll').mockResolvedValueOnce(resultModel)

    const data = await VoteService.getVotesByAnswer(answerId)
    expect(Vote.findAll).toHaveBeenCalledTimes(1)
    expect(data).not.toBeNull()
})

test('test get votes by answer when answer does not exist', async() => {
    const answerId = faker.random.number()

    const answer: any = {id: answerId}
    jest.spyOn(Answer, 'findByPk').mockResolvedValueOnce(null)

    
    await VoteService.getVotesByAnswer(answerId)
    expect(Vote.findAll).toHaveBeenCalledTimes(0)
})