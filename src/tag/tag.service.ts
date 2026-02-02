import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { TagEntity } from "./tag.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(TagEntity) private readonly repository: Repository<TagEntity>,
    ) {}

    async findAll(): Promise<TagEntity[]> {
        return await this.repository.find({
            order: { name: 'ASC'}
        });
    }

    async findById(id: string): Promise<TagEntity> {
        const tag = await this.repository.findOne({
            where: { id },
        });
        
        if (!tag) throw new NotFoundException('태그를 찾을 수 없습니다.');
        
        return tag;
    }

    async create(tagInput: Partial<TagEntity>): Promise<TagEntity> {
        const exists = await this.repository.findOne({
            where: { name: tagInput.name },
        });

        if (exists) {
            throw new BadRequestException('이미 존재하는 태그입니다.');
        }

        const tag = this.repository.create({
            name: tagInput.name,
        });

        return this.repository.save(tag);
    }

    async delete(id: string): Promise<boolean> {
        const tag = await this.repository.findOne({
            where: { id },
        });

        if (!tag) throw new NotFoundException('태그를 찾을 수 없습니다.');

        await this.repository.remove(tag);
        return true;
    }
}