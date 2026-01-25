import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()

        const user = request.user 

        if(!user) {
            throw new UnauthorizedException('User not found')
        }

        if (data) {
            return user[data]
        }

        return user;
    }
)