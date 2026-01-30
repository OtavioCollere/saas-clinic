import {
	Body,
	Controller,
	HttpCode,
	Post,
  } from '@nestjs/common'
  import {
	ApiBadRequestResponse,
	ApiExtraModels,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	getSchemaPath,
  } from '@nestjs/swagger'
  
  import { AuthenticateUserUseCase } from '@/domain/application/use-cases/users/authenticate-user'
  import { RegisterUserUseCase } from '@/domain/application/use-cases/users/register-user'
  import { AuthenticateUserDto } from './dtos/authenticate-user.dto'
  import { RegisterUserDto } from './dtos/register-user.dto'
  import { AuthenticatedResponseDto } from './dtos/authenticated-response.dto'
  import { MfaRequiredResponseDto } from './dtos/mfa-required-response.dto'
  
  @ApiTags('Auth')
  @ApiExtraModels(AuthenticatedResponseDto, MfaRequiredResponseDto)
  @Controller('/auth')
  export class AuthController {
	constructor(
	  private authenticateUser: AuthenticateUserUseCase,
	  private registerUser: RegisterUserUseCase,
	) {}
  
	@Post('/login')
	@HttpCode(200)
	@ApiOperation({ summary: 'Authenticate user' })
	@ApiOkResponse({
	  description: 'User authenticated or MFA required',
	  schema: {
		oneOf: [
		  { $ref: getSchemaPath(AuthenticatedResponseDto) },
		  { $ref: getSchemaPath(MfaRequiredResponseDto) },
		],
	  },
	})
	@ApiBadRequestResponse({ description: 'Invalid credentials' })
	async login(@Body() body: AuthenticateUserDto) {
	  const result = await this.authenticateUser.execute(body)
  
	  if (result.isLeft()) {
		throw new Error('Invalid credentials') // mapeia pra 401 via filter
	  }
  
	  return result.value
	}
  
	@Post('/register')
	@ApiOperation({ summary: 'Register new user' })
	@ApiOkResponse({
	  description: 'User registered successfully',
	})
	@ApiBadRequestResponse({
	  description: 'Email or CPF already exists / Invalid data',
	})
	async register(@Body() body: RegisterUserDto) {
	  const result = await this.registerUser.execute(body)
  
	  if (result.isLeft()) {
		throw new Error('Invalid data')
	  }
  
	  return result.value
	}
  }
  