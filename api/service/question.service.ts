import { QuestionDto } from "../dto/question.dto"
import { Question } from '../model/question.model'
import debug from 'debug';
import ResponseCode from "../enum/response.code";
import { User } from "../model/user.model";
import { getPagination, getPagingData } from "./util/pagination.util";


/*
   The QuestionService centralizes the data access by making it reachable by the controller;
   it also defines the business logic
*/

const log: debug.IDebugger = debug('app:question-service');

class QuestionService {

    private static instance: QuestionService

    /*
        the getInstance ensures that only one instance of QuestionService
        would persist in the memory during the application's life cycle
        by restricts instantiation of this class to just one object.
    */    
    static getInstance(): QuestionService {
        if (!QuestionService.instance) {
            QuestionService.instance = new QuestionService()
        }
        return QuestionService.instance
    }


    /**
     * Creates a new user
     *
     * @param QuestionDto - has the Question information to be stored
     * @param userId - the id of the user asking the question to be created
     * @returns a question object if operation is successful, while
     * it returns an error response object if operation fails
     *
    */
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

    /**
     * Gets All questions asked by a user
     *
     * @param id - userId
     * @param page - page number for pagination
     * @param size - page size for pagination
     * @returns paginated user questions
     *
    */
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


    /**
     * Gets All questions
     *
     * @param page - page number for pagination
     * @param size - page size for pagination
     * @returns paginated questions
     *
    */
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