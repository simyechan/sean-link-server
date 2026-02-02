import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class AdminEntity extends CommonEntity {
    @Column({ unique: true, nullable: false })
    loginId: string;

    @Column({ nullable: false })
    password: string;
    
    @Column({ nullable: true })
    refreshToken: string | null;
}