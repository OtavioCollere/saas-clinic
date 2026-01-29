import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO para registro de usuário
 * 
 * @description
 * Este DTO representa os dados necessários para registrar um novo usuário no sistema.
 * Após o registro bem-sucedido, retorna os dados do usuário criado.
 */
export class RegisterUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    type: String,
    minLength: 3,
  })
  name!: string

  @ApiProperty({
    description: 'CPF do usuário (apenas números)',
    example: '12345678900',
    type: String,
    pattern: '^[0-9]{11}$',
  })
  cpf!: string

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@email.com',
    type: String,
    format: 'email',
  })
  email!: string

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
    type: String,
    minLength: 6,
  })
  password!: string
}

