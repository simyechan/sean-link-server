import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity) private readonly repository: Repository<AdminEntity>,
        private readonly configService: ConfigService,
    ) {}

    async signup(loginId: string, password: string): Promise<AdminEntity> {
        const exists = await this.repository.findOne({ where: { loginId } });
        if (exists) {
            throw new ConflictException('이미 존재하는 관리자입니다.');
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = this.repository.create({
            loginId,
            password: hashedPassword,
        });

        return this.repository.save(admin);
    }

    async login(loginId: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const admin = await this.repository.findOne({ where: { loginId } });
    
        if (!admin) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
        }

        const accessToken = this.createAccessToken(admin);
        const refreshToken = this.createRefreshToken(admin);

        admin.refreshToken = await bcrypt.hash(refreshToken, 10);
        await this.repository.save(admin);

        return { accessToken, refreshToken };
    }

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        const payload = jwt.verify(
            refreshToken,
            this.configService.getOrThrow<string>('ADMIN_REFRESH_TOKEN_SECRET')
        ) as any;

        const admin = await this.repository.findOne({ where: { id: payload.id } });
        if (!admin || !admin.refreshToken) {
            throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
        }

        const isValid = await bcrypt.compare(refreshToken, admin.refreshToken);
        if (!isValid) {
            throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
        }

        const accessToken = this.createAccessToken(admin);
        return { accessToken };
    }

    async logout(id: number): Promise<boolean> {
        await this.repository.update(id, { refreshToken: null });
        return true
    }

    private createAccessToken(admin: AdminEntity) {
        return jwt.sign(
            { id: admin.id, loginId: admin.loginId },
            this.configService.getOrThrow<string>('ADMIN_ACCESS_TOKEN_SECRET'),
            { expiresIn: '1h' }
        );
    }

    private createRefreshToken(admin: AdminEntity) {
        return jwt.sign(
            { id: admin.id, loginId: admin.loginId },
            this.configService.getOrThrow<string>('ADMIN_REFRESH_TOKEN_SECRET'),
            { expiresIn: '7d' }
        );
    }
}