import { QuestionDto } from "../dto/question.dto"
import { Question } from '../model/question.model'
import debug from 'debug';
import ResponseCode from "../enum/response.code";

const log: debug.IDebugger = debug('app:question-service');

class QuestionService {

    private static instance: QuestionService

    static getInstance(): QuestionService {
        if (!QuestionService.instance) {
            QuestionService.instance = new QuestionService()
        }
        return QuestionService.instance
    }

    async createQuestion (questionDto: QuestionDto) {
        return Question.create({
            userId: questionDto.userId,
            title: questionDto.title,
            body: questionDto.body
        })
        .catch (e => {
            return ResponseCode.SYSTEM_ERROR
        })
    }
}

export default QuestionService.getInstance()