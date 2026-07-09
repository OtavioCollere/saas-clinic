import {
  Controller,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtService } from "@nestjs/jwt";
import type { FastifyRequest } from "fastify";
import { Public } from "@/infra/auth/public";

@Public()
@ApiTags("Users")
@Controller("/users")
export class RefreshTokenController {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  @Post("/refresh")
  @HttpCode(200)
  @ApiOperation({
    summary: "Refresh access token",
    description:
      "Uses the refresh token cookie to issue a new access token cookie.",
  })
  @ApiOkResponse({ description: "Access token refreshed successfully" })
  async handle(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: any,
  ) {
    const refreshToken = (request.cookies as Record<string, string>)
      ?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    let payload: { sub: string; role?: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const newAccessToken = await this.jwtService.signAsync(
      { sub: payload.sub, role: payload.role },
      { expiresIn: "15m" },
    );

    const isProduction = process.env.NODE_ENV === "production";

    reply.setCookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return { message: "Token refreshed successfully" };
  }
}
