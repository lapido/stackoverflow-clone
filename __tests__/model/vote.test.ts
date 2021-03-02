import { VoteType } from "../../api/enum/vote.type"
import faker from 'faker'
import { User } from "../../api/model/user.model"
import { Question } from "../../api/model/question.model"
import { Answer } from "../../api/model/answer.model"
import { Vote } from "../../api/model/vote.model"

test('Should create vote', async() => {
    const voteType: VoteType = VoteType.DOWNVOTE

    const user = await User.create({
        displayName: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        title: faker.lorem.word(3),
        location: faker.address.country(),
        githubUsername: faker.internet.userName(),
        twitterUsername: faker.internet.userName(),
        websiteLink: faker.internet.url(),
        password: faker.internet.password()
    })

    const question = await Question.create({
        title: faker.lorem.word(),
        body: faker.lorem.paragraph(),
        userId: user.id
    })

    const answer = await Answer.create({
        userId: user.id,
        questionId: question.id,
        body: faker.lorem.paragraph()
    })

    const vote = await Vote.create({
        userId: user.id,
        answerId: answer.id,
        voteType: voteType
    })

    expect(vote.id).not.toBeNull()
    expect(vote.voteType).toBe(voteType)
    expect(vote.answerId).toBe(answer.id)
})