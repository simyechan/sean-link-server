import { CommonEntity } from "src/common/entities/common.entity";
import { PlaylistEntity } from "src/playlist/playlist.entity";
import { VideoEntity } from "src/video/video.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class TagEntity extends CommonEntity {
    @Column({ type: 'varchar', unique: true, comment: '태그 이름' })
    name: string;

    @ManyToMany(() => VideoEntity, (video) => video.tags)
    videos: VideoEntity[];

    @ManyToMany(() => PlaylistEntity, (playlist) => playlist.tags)
    playlists: PlaylistEntity[];
}