import faker from 'faker'
import {User} from '../../api/model/user.model';

test('should create user', async () => {
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

    const userModel = await User.create({
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        title: title,
        location: location,
        githubUsername: githubUsername,
        twitterUsername: twitterUsername,
        websiteLink: websiteLink,
        password: password
    })
    // const after = Date.now()
    expect(userModel.id).not.toBeNull()
    expect(userModel.id).toBeGreaterThan(0)
    
    const fetchedUser = await User.findByPk(userModel.id)

    expect(fetchedUser!.email).toBe(email)
    expect(fetchedUser!.firstName).toBe(firstName)
    expect(fetchedUser!.lastName).toBe(lastName)
    expect(fetchedUser!.title).toBe(title)
    expect(fetchedUser!.location).toBe(location)
    expect(fetchedUser!.githubUsername).toBe(githubUsername)
    expect(fetchedUser!.twitterUsername).toBe(twitterUsername)
    expect(fetchedUser!.websiteLink).toBe(websiteLink)
    expect(fetchedUser!.password).not.toBe(password)
})

test('should update user', async() => {
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

    const user = await User.create({
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        title: title,
        location: location,
        githubUsername: githubUsername,
        twitterUsername: twitterUsername,
        websiteLink: websiteLink,
        password: password
    })

    const displayNameChange = faker.internet.userName()
    user.displayName = displayNameChange

    const userChanged = await user.save()
    expect(userChanged.displayName).toEqual(displayNameChange)
})