import faker from 'faker'
import { Answer } from '../../api/model/answer.model';
import { Question } from '../../api/model/question.model';
import {User} from '../../api/model/user.model';

test ('should create answer', async() => {
    const body = faker.lorem.paragraph()

    const questionTitle = faker.lorem.lines()
    const questionBody = faker.lorem.paragraph()
    const displayName = faker.internet.userName()
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const email = faker.internet.email()
    const userTitle = faker.lorem.word(3)
    const location = faker.address.county()
    const githubUsername = faker.internet.userName()
    const twitterUsername = faker.internet.userName()
    const websiteLink = faker.internet.url()
    const password = faker.internet.password()

    const userModel = await User.create({
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        title: userTitle,
        location: location,
        githubUsername: githubUsername,
        twitterUsername: twitterUsername,
        websiteLink: websiteLink,
        password: password
    })
    const question = await Question.create({
        title: questionTitle,
        body: questionBody,
        userId: userModel.id
    })

    const answer = await Answer.create({
        userId: userModel.id,
        questionId: question.id,
        body: body
    })

    expect(answer.id).not.toBeNull()
    expect(answer.body).toBe(body)
    expect(answer.userId).toBe(userModel.id)
    expect(answer.questionId).toBe(question.id)
})