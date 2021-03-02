import faker from 'faker'
import { Question } from '../../api/model/question.model';
import {User} from '../../api/model/user.model';

test('should create question', async() => {
    const title = faker.lorem.lines()
    const body = faker.lorem.paragraph()
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
        title: title,
        body: body,
        userId: userModel.id
    })

    expect(question.id).not.toBeNull()
    expect(question.title).toBe(title)
    expect(question.body).toBe(body)
    expect(question.userId).toBe(userModel.id)
})