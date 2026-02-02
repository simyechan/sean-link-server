import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as jwt from 'jsonwebtoken';

interface AdminJwtPayload {
  id: number;
  loginId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const gqlCtx = GqlExecutionContext.create(context);
        const req = gqlCtx.getContext().req;

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('인증 헤더가 없습니다.');
        }

        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('유효하지 않은 인증 헤더 형식입니다.');
        }

        try {
            const payload = jwt.verify(
                token,
                this.configService.getOrThrow<string>('ADMIN_ACCESS_TOKEN_SECRET'),
            ) as unknown as AdminJwtPayload;
            req.admin = {
                id: payload.id,
                loginId: payload.loginId,
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException('유효하지 않은 액세스 토큰입니다.');
        }
    }
}