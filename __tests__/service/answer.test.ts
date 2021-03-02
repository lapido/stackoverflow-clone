import faker from 'faker'
import { AnswerDto } from '../../api/dto/answer.dto'
import { Answer } from '../../api/model/answer.model'
import { Question } from '../../api/model/question.model'
import { User } from '../../api/model/user.model'
import AnswerService from '../../api/service/answer.service'

jest.mock('../../api/model/answer.model')

afterEach(() => {
    jest.clearAllMocks()
  })


test('should create answer', async () => {
    const body = faker.lorem.paragraph()
    const userId = faker.random.number()
    const questionId = faker.random.number()

    const answerDto: AnswerDto = {
        userId: userId,
        questionId: questionId,
        body: body
    }

    const user: any = {id: userId}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)
    
    const question: any = {id: questionId}
    const questionModel = new Promise<any>((resolve, reject) => {
        resolve(question);
      });
    jest.spyOn(Question, 'findByPk').mockResolvedValueOnce(questionModel)
    
    jest.spyOn(Answer, 'findOne').mockResolvedValueOnce(null)

    const answer = await AnswerService.createAnswer(questionId, answerDto)
    expect(Answer.findOne).toHaveBeenCalledTimes(1)
    expect(Answer.create).toHaveBeenCalledTimes(1)
    expect(Answer.update).toHaveBeenCalledTimes(0)
})

test('should update answer', async() => {
    const body = faker.lorem.paragraph()
    const userId = faker.random.number()
    const questionId = faker.random.number()

    const answerDto: AnswerDto = {
        userId: userId,
        questionId: questionId,
        body: body
    }

    const user: any = {id: userId}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)
    
    const question: any = {id: questionId}
    const questionModel = new Promise<any>((resolve, reject) => {
        resolve(question);
      });
    jest.spyOn(Question, 'findByPk').mockResolvedValueOnce(questionModel)
    
    const answerData: any = {id: faker.random.number()}
    const answerModel = new Promise<any>((resolve, reject) => {
        resolve(answerData);
      });
    jest.spyOn(Answer, 'findOne').mockResolvedValueOnce(answerModel)

    const updateStatus: number = 1
    const updateRes: any = [updateStatus, answerData]
    const updateModel = new Promise<any>((resolve, reject) => {
        resolve(updateRes);
      });
    jest.spyOn(Answer, 'update').mockResolvedValueOnce(updateModel)  

    await AnswerService.createAnswer(questionId, answerDto)
    expect(Answer.findOne).toHaveBeenCalledTimes(1)
    expect(Answer.create).toHaveBeenCalledTimes(0)
    expect(Answer.update).toHaveBeenCalledTimes(1)
})

test('test answer submission when user does not exist', async() => {
    const body = faker.lorem.paragraph()
    const userId = faker.random.number()
    const questionId = faker.random.number()

    const answerDto: AnswerDto = {
        userId: userId,
        questionId: questionId,
        body: body
    }

    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null)

    await AnswerService.createAnswer(questionId, answerDto)
    expect(Answer.findOne).toHaveBeenCalledTimes(0)
    expect(Answer.create).toHaveBeenCalledTimes(0)
    expect(Answer.update).toHaveBeenCalledTimes(0)
})

test('test answer submission when question does not exist', async() => {
    const body = faker.lorem.paragraph()
    const userId = faker.random.number()
    const questionId = faker.random.number()

    const answerDto: AnswerDto = {
        userId: userId,
        questionId: questionId,
        body: body
    }

    const user: any = {id: userId}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)
    
    jest.spyOn(Question, 'findByPk').mockResolvedValueOnce(null)

    await AnswerService.createAnswer(questionId, answerDto)
    expect(Answer.findOne).toHaveBeenCalledTimes(0)
    expect(Answer.create).toHaveBeenCalledTimes(0)
    expect(Answer.update).toHaveBeenCalledTimes(0)
})

test('test get answers by question', async() => {
    const mock = jest.fn();
    let pagingDataMock = mock("getPagingData");

    pagingDataMock.mockResolvedValueOnce({totalItemCount: 9, data: [], 
        totalPages: 1, currentPage: 1})

    const questionId = faker.random.number()
    const page = faker.random.number()
    const size = faker.random.number()

    const question: any = {id: questionId}
    const questionModel = new Promise<any>((resolve, reject) => {
        resolve(question);
      });
    jest.spyOn(Question, 'findByPk').mockResolvedValueOnce(questionModel)

    const findAllCount = { rows: [], count: 9}
    const findAllModel = new Promise<any>((resolve, reject) => {
        resolve(findAllCount);
      });
    jest.spyOn(Answer, 'findAndCountAll').mockResolvedValueOnce(findAllModel)

    await AnswerService.getAnswersByQuestion(questionId, page, size)
    expect(pagingDataMock).toHaveBeenCalledTimes(1)
    expect(Answer.findAndCountAll).toHaveBeenCalledTimes(1)
})

test('test get answers by question when question does not exist', async() => {
    const mock = jest.fn();
    const questionId = faker.random.number()
    const page = faker.random.number()
    const size = faker.random.number()

    jest.spyOn(Question, 'findByPk').mockResolvedValueOnce(null)
    
    let pagingDataMock = mock("getPagingData");

    await AnswerService.getAnswersByQuestion(questionId, page, size)
    expect(pagingDataMock).toHaveBeenCalledTimes(0)
    expect(Answer.findAndCountAll).toHaveBeenCalledTimes(0)
})