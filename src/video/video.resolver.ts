import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VideoModel } from "./dto/video.model";
import { UseGuards } from "@nestjs/common";

@Resolver(() => VideoModel)
export class VideoResolver {
    constructor(
        private readonly videoService: any,
    ) {}

    @Query(() => [VideoModel], { description: '모든 비디오 가져오기' })
    async getAllVideos(): Promise<VideoModel[]> {
        return this.videoService.findAll();
    }

    @Query(() => VideoModel, { description: '비디오 하나 가져오기' })
    async getVideoById(
        @Args('id') id: string,
    ): Promise<VideoModel> {
        await this.videoService.incrementViewCount(id);
        return await this.videoService.findById(id);
    }

    @Mutation(() => VideoModel, { description: '비디오 추가' })
    async addVideo(
        @Args('url') url: string,
    ): Promise<VideoModel> {
        return await this.videoService.create(url);
    }

    @Mutation(() => Boolean, { description: '비디오 삭제' })
    @UseGuards(AdminAuthGuard)
    async deleteVideo(
        @Args('id') id: string,
    ): Promise<boolean> {
        return await this.videoService.delete(id);
    }
}