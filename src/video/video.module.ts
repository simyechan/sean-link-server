import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoEntity } from "./video.entity";
import { VideoViewLogEntity } from "./video-view-log.entity";
import { VideoResolver } from "./video.resolver";
import { VideoService } from "./video.service";
import { TagModule } from "src/tag/tag.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([VideoEntity, VideoViewLogEntity]),
        TagModule,
    ],
    providers: [VideoResolver, VideoService],
})
export class VideoModule {}