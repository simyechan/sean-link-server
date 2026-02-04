import { CommonEntity } from "src/common/entities/common.entity";
import { PlaylistEntity } from "src/playlist/playlist.entity";
import { TagEntity } from "src/tag/tag.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class VideoEntity extends CommonEntity {
    @Column({ type: 'varchar', unique: true, comment: '영상 id' })
    videoId: string;

    @Column({ type: 'varchar', nullable: true, comment: '영상 url' })
    videoUrl?: string | null;

    @Column({ type: 'varchar', nullable: true, comment: '영상 제목' })
    videoTitle?: string | null;

    @Column({ type: 'varchar', nullable: true, comment: '썸네일' })
    thumbnail?: string | null;

    @Column({ type: 'int', nullable: true, comment: '영상 길이' })
    duration?: number | null;

    @Column({ type: 'varchar', nullable: true, comment: '채널 id' })
    channelId?: string | null;

    @Column({ type: 'varchar', nullable: true, comment: '채널 이름' })
    channelName?: string | null;

    @Column({ type: 'varchar', nullable: true, comment: '채널 이미지 url' })
    channelImageUrl?: string | null;

    @Column({ type: 'int', default: 0, comment: '조회수' })
    viewCount: number;

    @Column({ type: 'varchar', nullable: true, comment: '플랫폼' })
    platform?: string | null;

    @ManyToMany(() => TagEntity, (tag) => tag.videos, {
        cascade: true,
    })
    tags?: TagEntity[];

    @OneToMany(() => PlaylistEntity, (playlist) => playlist.videos, {
        cascade: true,
    })
    playlists: PlaylistEntity[];
}