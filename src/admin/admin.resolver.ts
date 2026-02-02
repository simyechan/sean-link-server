import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AdminLoginResponse, AdminModel } from "./dto/admin.model";
import { AdminService } from "./admin.service";
import { AdminLoginInput, AdminSignupInput } from "./dto/admin.input";
import { Context } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guards";
@Resolver(() => AdminModel)
export class AdminResolver {
    constructor(
        private adminService: AdminService,
    ) {}

    @Mutation(() => AdminModel)
    async adminSignup(
        @Args('signupInput') signupInput: AdminSignupInput,
    ): Promise<AdminModel> {
        return this.adminService.signup(signupInput.loginId, signupInput.password);
    }

    @Mutation(() => AdminLoginResponse)
    async adminLogin(
        @Args('loginInput') loginInput: AdminLoginInput,
        @Context() context: any,
    ): Promise<AdminLoginResponse> {
        const { accessToken, refreshToken } = await this.adminService.login(loginInput.loginId, loginInput.password);

        context.res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });

        context.res.setHeader('Authorization', `Bearer ${accessToken}`);
        return { accessToken };
    }

    @Mutation(() => Boolean)
    async adminRefresh(
        @Context() context: any,
    ): Promise<boolean> {
        const refreshToken = context.req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException('리프레시 토큰이 없습니다.');
        }

        const { accessToken } = await this.adminService.refresh(refreshToken);

        context.res.setHeader('Authorization', `Bearer ${accessToken}`);
        return true;
    }

    @Mutation(() => Boolean)
    @UseGuards(AdminAuthGuard)
    async adminLogout(
        @Context() context: any,
    ): Promise<boolean> {
        const admin = context.req.user;

        await this.adminService.logout(admin.id);

        context.res.clearCookie('refreshToken', {
            path: '/',
        });

        return true;
    }
}