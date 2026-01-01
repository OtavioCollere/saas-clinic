import { Email } from './../value-objects/email';
import { Cpf } from './../value-objects/cpf';
import type { UserRole } from '../value-objects/user-role';
import { Entity } from './../../../core/entities/entity';


export interface UserProps{
  name : string
  cpf : Cpf 
  email : Email 
  password : string
  role : UserRole
  updatedAt : Date
  createdAt : Date
}

export class User extends Entity<UserProps>{}