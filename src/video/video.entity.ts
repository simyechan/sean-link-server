import { CommonEntity } from "src/common/entities/common.entity";
import { TagEntity } from "src/tag/tag.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class Videoentity extends CommonEntity {
    @Column({ type: 'varchar', unique: true, comment: '영상 id' })
    videoId: string;

    @Column({ type: 'varchar', nullable: true, comment: '영상 url' })
    videoUrl: string;

    @Column({ type: 'varchar', nullable: true, comment: '영상 제목' })
    videoTitle: string;

    @Column({ type: 'varchar', nullable: true, comment: '썸네일' })
    thumbnail: string;

    @Column({ type: 'int', nullable: true, comment: '영상 길이' })
    duration: number;

    @Column({ type: 'varchar', nullable: true, comment: '채널 id' })
    channelId: string;

    @Column({ type: 'varchar', nullable: true, comment: '채널 이름' })
    channelName: string;

    @Column({ type: 'varchar', nullable: true, comment: '채널 이미지 url' })
    channelImageUrl: string;

    @Column({ type: 'int', default: 0, comment: '조회수' })
    viewCount: number;

    @Column({ type: 'varchar', nullable: true, comment: '플랫폼' })
    platform: string;

    @ManyToMany(() => TagEntity, (tag) => tag.videos, {
        cascade: true,
    })
    
    tags: TagEntity[];
}