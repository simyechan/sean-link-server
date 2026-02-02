import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "./tag.entity";
import { TagResolver } from "./tag.resolver";
import { TagService } from "./tag.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([TagEntity]),
    ],
    providers: [TagResolver, TagService],
    exports: [TypeOrmModule],
})
export class TagModule {}