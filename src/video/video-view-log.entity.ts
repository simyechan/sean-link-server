import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class VideoViewLogEntity extends CommonEntity {
    @Column({ type: 'varchar', comment: '영상 id' })
    videoId: string;

    @Column({ type: 'varchar', comment: 'ip' })
    ip: string;

    @Column({ type: 'date', comment: '조회 날짜' })
    viewDate: Date;
}