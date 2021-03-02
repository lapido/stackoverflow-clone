import faker from 'faker'
import UsersService from '../../api/service/user.service'
import {User, UserModel} from '../../api/model/user.model';
import ResponseCode from '../../api/enum/response.code'
import ConfigProperty from "../../config/env.config";
import * as bcrypt from 'bcrypt'

jest.mock('../../api/model/user.model')

afterEach(() => {
    jest.clearAllMocks()
  })

test('should register user', async () => {
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
    expect(User.findOne).toHaveBeenCalledTimes(1)
    expect(User.create).toHaveBeenCalledTimes(1)
})

test('should not save duplicate', async () => {
    const email: string = faker.internet.email();
    const userDto = {
        displayName : faker.internet.userName(),
        firstName : faker.name.firstName(),
        lastName : faker.name.lastName(),
        email : email,
        title : faker.lorem.word(3),
        location : faker.address.county(),
        githubUsername : faker.internet.userName(),
        twitterUsername : faker.internet.userName(),
        websiteLink : faker.internet.url(),
        password : faker.internet.password()
    }

    const user: any = {email: email}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
    });

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(userModel)
    
    await UsersService.register(userDto)
    expect(User.findOne).toHaveBeenCalledTimes(1)
    expect(User.create).toHaveBeenCalledTimes(0)
})

test('should get user by id', async () => {
    const userId: number = 1;
    
    const user: any = {email: faker.internet.email}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)

    await UsersService.getUserById(userId)
    expect(User.findByPk).toHaveBeenCalledTimes(1)
})

test('should get user by email', async () => {
    const email: string = faker.internet.email()

    const user: any = {email: faker.internet.email}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });
    
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(userModel)

    await UsersService.getUserByEmail(email)
    expect(User.findOne).toHaveBeenCalledTimes(1)
})

test('return USER_DOES_NOT_EXISTS if system tries to get userby email', async() => {
    const mock = jest.fn();
    let buildDtoMock = mock("buildDto");

    const email: string = faker.internet.email()

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(null)

    const rsp = await UsersService.getUserByEmail(email)
    expect(buildDtoMock).toHaveBeenCalledTimes(0)
})

test('return USER_DOES_NOT_EXISTS if system tries to get userby id', async() => {
    const mock = jest.fn();
    let buildDtoMock = mock("buildDto");
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null)

    const rsp = await UsersService.getUserById(1)
    expect(User.findByPk).toHaveBeenCalledTimes(1)
    expect(buildDtoMock).toHaveBeenCalledTimes(0)
})

test('test update user', async() => {
    const userDto = {
        displayName : faker.internet.userName(),
        firstName : faker.name.firstName(),
        lastName : faker.name.lastName(),
        email : faker.internet.email(),
        title : faker.lorem.word(3),
        location : faker.address.county(),
        githubUsername : faker.internet.userName(),
        twitterUsername : faker.internet.userName(),
        websiteLink : faker.internet.url()
    }

    const user: any = {email: faker.internet.email}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
      });

    const updateStatus: number = 1
    const updateRes: any = [updateStatus, user]
    const updateModel = new Promise<any>((resolve, reject) => {
        resolve(updateRes);
      });
    
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(userModel)
    jest.spyOn(User, 'update').mockResolvedValueOnce(updateModel)

    await UsersService.update(1, userDto)
    expect(User.findByPk).toHaveBeenCalledTimes(1)
    expect(User.update).toHaveBeenCalledTimes(1)
})

test('return USER_DOES_NOT_EXISTS if user does not exist during update', async () => {
    const userDto = {
        displayName : faker.internet.userName(),
        firstName : faker.name.firstName(),
        lastName : faker.name.lastName(),
        email : faker.internet.email(),
        title : faker.lorem.word(3),
        location : faker.address.county(),
        githubUsername : faker.internet.userName(),
        twitterUsername : faker.internet.userName(),
        websiteLink : faker.internet.url()
    }
    
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null)

    const rsp = await UsersService.update(1, userDto)
    expect(User.findByPk).toHaveBeenCalledTimes(1)
    expect(User.update).toHaveBeenCalledTimes(0)
    expect(rsp.code).not.toBeNull()
    expect(rsp.code).toBe(ResponseCode.USER_DOES_NOT_EXISTS.code)
})


test('test login when user does not exist', async() => {
    UsersService.generateToken = jest.fn()
    const email: string = faker.internet.email()
    const password: string = faker.internet.password()
    
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(null)

    await UsersService.login(email, password)
    expect(UsersService.generateToken).toHaveBeenCalledTimes(0)
})

test('test login when user password is incorrect', async() => {
    UsersService.generateToken = jest.fn()
    const email: string = faker.internet.email()
    const password: string = faker.internet.password()

    const user: any = {email: email, password: faker.internet.password()}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
    });

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(userModel)
    await UsersService.login(email, password)
    expect(UsersService.generateToken).toHaveBeenCalledTimes(0)
})

test('test login when user credentials is valid', async() => {
    UsersService.generateToken = jest.fn()
    const email: string = faker.internet.email()
    const password: string = 'Password12'

    const saltround = +ConfigProperty.SaltRound
    const hashedPassword = await bcrypt.hash(password, saltround)
    const user: any = {email: email, password: hashedPassword}
    const userModel = new Promise<any>((resolve, reject) => {
        resolve(user);
    });

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(userModel)
    await UsersService.login(email, password)
    expect(UsersService.generateToken).toHaveBeenCalledTimes(1)
})
