import faker from 'faker'
import UsersService from '../../api/service/user.service'
import {User} from '../../api/model/user.model';

jest.mock('./../api/model/user.model')

describe('my suite', () => {
    test.only('should register user', async() => {
        UsersService.getUserById = jest.fn()
    
        const displayName = faker.internet.userName()
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        const email = faker.internet.email()
        const title = faker.lorem.word(3)
        const location = faker.address.county()
        const githubUsername = faker.internet.userName()
        const twitterUsername = faker.internet.userName()
        const websiteLink = faker.internet.url()
        const password = faker.internet.password()
    
        const userDto = {
            displayName: displayName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            location: title,
            title: location,
            websiteLink: websiteLink,
            twitterUsername: twitterUsername,
            githubUsername: githubUsername,
            password: password
        }
    
        await UsersService.register(userDto)
        expect(User.create).toHaveBeenCalledTimes(1)
        expect(UsersService.getUserById).toHaveBeenCalledTimes(1)
    })
    
    test.only('should get user by id', async() => {
        const displayName = faker.internet.userName()
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        const email = faker.internet.email()
        const title = faker.lorem.word(3)
        const location = faker.address.county()
        const githubUsername = faker.internet.userName()
        const twitterUsername = faker.internet.userName()
        const websiteLink = faker.internet.url()
        const password = faker.internet.password()
    
        const user = {
            id: 9,
            displayName: displayName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            location: title,
            title: location,
            websiteLink: websiteLink,
            twitterUsername: twitterUsername,
            githubUsername: githubUsername,
            password: password
        }
        
        
    })    
});

