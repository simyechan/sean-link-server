import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TagModel } from "./dto/tag.model";
import { TagCreateInput } from "./dto/tag.input";
import { UseGuards } from "@nestjs/common";
import { TagService } from "./tag.service";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guards";

@Resolver(() => TagModel)
export class TagResolver {
    constructor(
        private readonly tagService: TagService,
    ) {}

    @Query(() => [TagModel], { description: '모든 태그 가져오기' })
    async getAllTags(): Promise<TagModel[]> {
        return this.tagService.findAll();
    }

    @Query(() => TagModel, { description: '태그 하나 가져오기' })
    async getTagById(
        @Args('id') id: string,
    ): Promise<TagModel> {
        return await this.tagService.findById(id);
    }

    @Mutation(() => TagModel, { description: '태그 추가' })
    async addTag(
        @Args('tagInput') tagInput: TagCreateInput,
    ): Promise<TagModel> {
        return await this.tagService.create(tagInput);
    }

    @Mutation(() => Boolean, { description: '태그 삭제' })
    @UseGuards(AdminAuthGuard)
    async deleteTag(
        @Args('id') id: string,
    ): Promise<boolean> {
        return await this.tagService.delete(id);
    }

}