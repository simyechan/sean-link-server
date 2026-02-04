import { CommonEntity } from "src/common/entities/common.entity";
import { TagEntity } from "src/tag/tag.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { PlaylistVideoEntity } from "./playlist-video.entity";

@Entity()
export class PlaylistEntity extends CommonEntity {
    @Column({ type: 'varchar', comment: '플레이리스트 이름' })
    name: string;

    @Column({ type: 'int', default: 0, comment: '플레이리스트 조회수'})
    viewCount: number;

    @OneToMany(() => PlaylistVideoEntity, (video) => video.playlist, { cascade: true })
    videos: PlaylistVideoEntity[];

    @ManyToMany(() => TagEntity, (tag) => tag.playlists, {
        cascade: true,
    })
    tags?: TagEntity[];
}