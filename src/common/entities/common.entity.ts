import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class CommonEntity {
    @PrimaryGeneratedColumn('uuid', { comment: '기본 키 (UUID)' })
    id: string;

    @CreateDateColumn({ type: 'timestamptz', comment: '생성 일시' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamptz', comment: '삭제 일시', nullable: true })
    deletedAt?: Date;

    @UpdateDateColumn({ type: 'timestamptz', comment: '수정 일시' })
    updatedAt: Date;
}