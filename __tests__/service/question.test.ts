import faker from 'faker'
import { QuestionDto } from '../../api/dto/question.dto'
import { Question } from '../../api/model/question.model'
import { User } from '../../api/model/user.model'
import QuestionService from '../../api/service/question.service'

jest.mock('../../api/model/question.model')

afterEach(() => {
    jest.clearAllMocks()
  })

test('should create question', async () => {
    const title = faker.lorem.lines()
    const body = faker.lorem.paragraph()
    const userId: number = faker.random.number()

    const questionDto: QuestionDto = {
        title: title,
        body: body,
        userId: userId
    }

    const user: any = {id: userId}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)

    await Question.create(questionDto)
    expect(User.findByPk).toHaveBeenCalledTimes(1)
    expect(Question.create).toHaveBeenCalledTimes(1)
})

test('Should not create question when user does not exist', async() => {
    const title = faker.lorem.lines()
    const body = faker.lorem.paragraph()
    const userId: number = faker.random.number()

    const questionDto: QuestionDto = {
        title: title,
        body: body,
        userId: userId
    }
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null)

    const rsp = await Question.create(questionDto)
    expect(User.findByPk).toHaveBeenCalledTimes(1)
    expect(Question.create).toHaveBeenCalledTimes(0)
})

test('Should not create question when input (userId) is invalid', async() => {
    const title = faker.lorem.lines()
    const body = faker.lorem.paragraph()
    const userId: number = 0

    const questionDto: QuestionDto = {
        title: title,
        body: body,
        userId: userId
    }
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null)

    const rsp = await Question.create(questionDto)
    expect(User.findByPk).toHaveBeenCalledTimes(1)
    expect(QuestionService.createQuestion).toHaveBeenCalledTimes(0)
})

test('test getQuestionsbyUser', async() => {
    const mock = jest.fn();
    let pagingDataMock = mock("getPagingData");

    pagingDataMock.mockResolvedValueOnce({totalItemCount: 9, data: [], 
        totalPages: 1, currentPage: 1})

    const userId = faker.random.number()
    const page = faker.random.number()
    const size = faker.random.number()

    const user: any = {id: userId}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)

    const findAllCount = { rows: [], count: 9}
    const findAllModel = new Promise<any>((resolve, reject) => {
        resolve(findAllCount);
      });
    jest.spyOn(Question, 'findAndCountAll').mockResolvedValueOnce(findAllModel)

    await QuestionService.getQuestionsByUser(userId, page, size)
    expect(pagingDataMock).toHaveBeenCalledTimes(1)
    expect(Question.findAndCountAll).toHaveBeenCalledTimes(1)
})

test('test getQuestionsbyUser when user does not exist', async() => {
    const mock = jest.fn();
    let pagingDataMock = mock("getPagingData");

    pagingDataMock.mockResolvedValueOnce({totalItemCount: 9, data: [], 
        totalPages: 1, currentPage: 1})

    const userId = faker.random.number()
    const page = faker.random.number()
    const size = faker.random.number()

    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null)

    await QuestionService.getQuestionsByUser(userId, page, size)
    expect(pagingDataMock).toHaveBeenCalledTimes(0)
    expect(Question.findAndCountAll).toHaveBeenCalledTimes(0)
})

test('test getQuestionsbyUser page input <= 0', async() => {
    const mock = jest.fn();
    let pagingDataMock = mock("getPagingData");

    const userId = faker.random.number()
    const page = 0
    const size = faker.random.number()

    await QuestionService.getQuestionsByUser(userId, page, size)
    expect(pagingDataMock).toHaveBeenCalledTimes(0)
    expect(Question.findAndCountAll).toHaveBeenCalledTimes(0)
})

test('test getQuestionsbyUser size input <= 0', async() => {
    const mock = jest.fn();
    let pagingDataMock = mock("getPagingData");

    const userId = faker.random.number()
    const page = faker.random.number()
    const size = 0

    await QuestionService.getQuestionsByUser(userId, page, size)
    expect(pagingDataMock).toHaveBeenCalledTimes(0)
    expect(Question.findAndCountAll).toHaveBeenCalledTimes(0)
})


test('test getAllQuestions', async() => {
    const mock = jest.fn();
    let pagingDataMock = mock("getPagingData");

    pagingDataMock.mockResolvedValueOnce({totalItemCount: 9, data: [], 
        totalPages: 1, currentPage: 1})
    const page = faker.random.number()
    const size = faker.random.number()

    const findAllCount = { rows: [], count: 9}
    const findAllModel = new Promise<any>((resolve, reject) => {
        resolve(findAllCount);
      });
    jest.spyOn(Question, 'findAndCountAll').mockResolvedValueOnce(findAllModel)

    await QuestionService.getQuestions(page, size)
    expect(pagingDataMock).toHaveBeenCalledTimes(1)
    expect(Question.findAndCountAll).toHaveBeenCalledTimes(1)
})

test('test getAllQuestions when page is <= 0', async() => {
    const mock = jest.fn();
    let pagingDataMock = mock("getPagingData");

    pagingDataMock.mockResolvedValueOnce({totalItemCount: 9, data: [], 
        totalPages: 1, currentPage: 1})
    const page = 0
    const size = faker.random.number()

    const findAllCount = { rows: [], count: 9}
    const findAllModel = new Promise<any>((resolve, reject) => {
        resolve(findAllCount);
      });
    jest.spyOn(Question, 'findAndCountAll').mockResolvedValueOnce(findAllModel)

    await QuestionService.getQuestions(page, size)
    expect(pagingDataMock).toHaveBeenCalledTimes(0)
    expect(Question.findAndCountAll).toHaveBeenCalledTimes(0)
})

test('test getAllQuestions when size is <= 0', async() => {
    const mock = jest.fn();
    let pagingDataMock = mock("getPagingData");

    pagingDataMock.mockResolvedValueOnce({totalItemCount: 9, data: [], 
        totalPages: 1, currentPage: 1})
    const page = faker.random.number()
    const size = 0

    const findAllCount = { rows: [], count: 9}
    const findAllModel = new Promise<any>((resolve, reject) => {
        resolve(findAllCount);
      });
    jest.spyOn(Question, 'findAndCountAll').mockResolvedValueOnce(findAllModel)

    await QuestionService.getQuestions(page, size)
    expect(pagingDataMock).toHaveBeenCalledTimes(0)
    expect(Question.findAndCountAll).toHaveBeenCalledTimes(0)
})