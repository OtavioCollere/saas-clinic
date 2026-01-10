import { User, UserProps } from "@/domain/enterprise/entities/user";
import { Cpf } from "@/domain/enterprise/value-objects/cpf";
import { Email } from "@/domain/enterprise/value-objects/email";
import { UserRole } from "@/domain/enterprise/value-objects/user-role";

export function makeUser(override : Partial<UserProps> = {}) : User {
  const user = User.create({
    name : 'John Doe',
    cpf : Cpf.create('11144477735'),
    email : Email.create('john.doe@example.com'),
    password : '123456',
    role : UserRole.owner(),
    ...override,
  })

  return user;
}

