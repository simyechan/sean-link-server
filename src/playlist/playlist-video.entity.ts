import { Column, Entity, ManyToOne, Unique } from "typeorm";
import { PlaylistEntity } from "./playlist.entity";
import { VideoEntity } from "src/video/video.entity";
import { CommonEntity } from "src/common/entities/common.entity";

@Entity()
@Unique(['playlistId', 'videoId'])
export class PlaylistVideoEntity extends CommonEntity {
    @Column({ type: 'int', default: 0, comment: '비디오 순서' })
    order: number;

    @Column({ type: 'varchar', comment: '플레이리스트 아이디' })
    playlistId: string;

    @Column({ type: 'varchar', comment: '비디오 아이디' })
    videoId: string;

    @ManyToOne(() => PlaylistEntity, (playlist) => playlist.videos, { onDelete: 'CASCADE' })
    playlist: PlaylistEntity;

    @ManyToOne(() => VideoEntity, (video) => video.playlists, { onDelete: 'CASCADE' })
    video: VideoEntity;
}