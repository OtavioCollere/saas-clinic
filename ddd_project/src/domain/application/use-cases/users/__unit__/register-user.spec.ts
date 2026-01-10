import {beforeEach, describe, expect, it} from 'vitest'
import { RegisterUserUseCase } from '../register-user'
import { InMemoryUsersRepository } from 'tests/in-memory-repositories/in-memory-users-repository'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { UserRole } from '@/domain/enterprise/value-objects/user-role'
import { isRight, unwrapEither } from '@/core/either/either'

describe(() => {

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
            cpf : '09982872782',
            email : 'otavio@gmail.com',
            password : '1234',
            role : UserRole.owner()
        })

        expect(isRight(result)).toBeTruthy()
        if(isRight(result)) {
            expect(unwrapEither(result).user.password).toEqual('1234-hashed')
        }

    })

    it("should not be able to regiser a user with existent email", () => {})
})