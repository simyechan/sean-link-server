import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { AdminResolver } from "./admin.resolver";
import { AdminService } from "./admin.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([AdminEntity]),
    ],
    providers: [AdminResolver, AdminService],
})
export class AdminModule {}