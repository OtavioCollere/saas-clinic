import {beforeEach, describe, expect, it} from 'vitest'
import { InMemoryUsersRepository } from 'tests/in-memory-repositories/in-memory-users-repository'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { isLeft, isRight, unwrapEither } from '@/core/either/either'
import { makeUser } from 'tests/factories/makeUser'
import { Email } from '@/domain/enterprise/value-objects/email'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { AuthenticateUserUseCase } from '../authenticate-user'
import { FakeEncrypter } from 'tests/cryptography/fake-encrypter'

describe('AuthenticateUserUseCase Unit Tests', () => {

    let sut: AuthenticateUserUseCase
    let inMemoryUsersRepository : InMemoryUsersRepository
    let fakeHasher : FakeHasher
    let fakeEncrypter : FakeEncrypter

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()
        sut = new AuthenticateUserUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter)
    })

    it("should be able to authenticate a user", async () => {

        const user = makeUser({
            email : Email.create('otavio@gmail.com'),
            password : fakeHasher.hash('1234'),
        })
        inMemoryUsersRepository.items.push(user)

        const result = await sut.execute({
          email : 'otavio@gmail.com',
          password : '1234'
        })

        expect(isRight(result)).toBeTruthy()
        if(isRight(result)) {
            expect(unwrapEither(result)).toEqual(
              expect.objectContaining({
                access_token : 'signed-token',
                refresh_token : 'refresh-token'
              })
            )
        }

    })

    it("should not be able to authenticate a user with non existent email", async () => {
        const result = await sut.execute({
            email : 'otavio@gmail.com',
            password : '1234'
        })

        expect(isLeft(result)).toBeTruthy()
        expect(unwrapEither(result)).toBeInstanceOf(WrongCredentialsError)
    })

    it("should not be able to authenticate a user with wrong password", async () => {
        const user = makeUser({
            email : Email.create('otavio@gmail.com'),
            password : fakeHasher.hash('1234'),
        })
        inMemoryUsersRepository.items.push(user)

        const result = await sut.execute({
            email : 'otavio@gmail.com',
            password : 'wrong-password'
        })

        expect(isLeft(result)).toBeTruthy()
        expect(unwrapEither(result)).toBeInstanceOf(WrongCredentialsError)
    })
})