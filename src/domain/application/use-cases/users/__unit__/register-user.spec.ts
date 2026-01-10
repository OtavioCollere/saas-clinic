import {beforeEach, describe, expect, it} from 'vitest'
import { RegisterUserUseCase } from '../register-user'
import { InMemoryUsersRepository } from 'tests/in-memory-repositories/in-memory-users-repository'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { UserRole } from '@/domain/enterprise/value-objects/user-role'
import { isLeft, isRight, unwrapEither } from '@/core/either/either'
import { makeUser } from 'tests/factories/makeUser'
import { Cpf } from '@/domain/enterprise/value-objects/cpf'
import { Email } from '@/domain/enterprise/value-objects/email'
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists-error'

describe('RegisterUserUseCase Unit Tests', () => {

    let sut: RegisterUserUseCase
    let inMemoryUsersRepository : InMemoryUsersRepository
    let fakeHasher : FakeHasher

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        fakeHasher = new FakeHasher()
        sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher)
    })

    it("should be able to register a user", async () => {

        const result = await sut.execute({
            name : "Otavio",
            cpf : '11144477735',
            email : 'otavio@gmail.com',
            password : '1234',
            role : UserRole.owner()
        })

        expect(isRight(result)).toBeTruthy()
        if(isRight(result)) {
            expect(unwrapEither(result).user.password).toEqual('1234-hashed')
        }

    })

    it("should not be able to regiser a user with existent email", async () => {
        inMemoryUsersRepository.items.push(makeUser({
            name : "Otavio",
            cpf : Cpf.create('11144477735'),
            email : Email.create('otavio@gmail.com'),
            password : '1234',
            role : UserRole.owner()
        }))

        const result = await sut.execute({
            name : "Otavio",
            cpf : '11144477735',
            email : 'otavio@gmail.com',
            password : '1234',
            role : UserRole.owner()
        })

        expect(isLeft(result)).toBeTruthy()
        expect(unwrapEither(result)).toBeInstanceOf(EmailAlreadyExistsError)
    })
})