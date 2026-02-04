import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlaylistEntity } from "./playlist.entity";
import { PlaylistResolver } from "./playlist.resolver";
import { PlaylistService } from "./playlist.service";
import { VideoModule } from "src/video/video.module";

@Module({
    imports: [TypeOrmModule.forFeature([PlaylistEntity])],
    providers: [PlaylistResolver, PlaylistService],
})
export class PlaylistModule {}