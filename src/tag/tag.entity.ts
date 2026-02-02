import { CommonEntity } from "src/common/entities/common.entity";
import { Videoetity } from "src/video/video.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class TagEntity extends CommonEntity {
    @Column({ type: 'varchar', unique: true, comment: '태그 이름' })
    name: string;

    @ManyToMany(() => Videoetity, (video) => video.tags)
    videos: Videoetity[];
}