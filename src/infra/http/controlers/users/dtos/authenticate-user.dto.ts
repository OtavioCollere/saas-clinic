import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO para autenticação de usuário
 * 
 * @description
 * Este DTO representa os dados necessários para autenticar um usuário no sistema.
 * Após a autenticação bem-sucedida, o sistema pode retornar:
 * - Tokens de acesso e refresh (se MFA não estiver habilitado)
 * - Session ID e flag mfa_required (se MFA estiver habilitado)
 */
export class AuthenticateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@email.com',
    type: String,
    format: 'email',
  })
  email!: string

  @ApiProperty({
    description: 'Senha do usuário',
    example: '123456',
    type: String,
    minLength: 6,
  })
  password!: string
}
