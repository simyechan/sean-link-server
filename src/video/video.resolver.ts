import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VideoModel } from "./dto/video.model";
import { UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guards";
import { VideoService } from "./video.service";

@Resolver(() => VideoModel)
export class VideoResolver {
    constructor(
        private readonly videoService: VideoService,
    ) {}

    @Query(() => [VideoModel], { description: '모든 비디오 가져오기' })
    async getAllVideos(): Promise<VideoModel[]> {
        return this.videoService.findAll();
    }

    @Query(() => VideoModel, { description: '비디오 하나 가져오기' })
    async getVideoById(
        @Args('id') id: string,
        @Context() context: any,
    ): Promise<VideoModel> {
        const ip = context.req.headers['x-forwarded-for']?.split(',')[0] || context.req.connection.remoteAddress;
        await this.videoService.incrementViewCount(id, ip);
        return await this.videoService.findById(id);
    }

    @Mutation(() => VideoModel, { description: '비디오 추가' })
    async addVideo(
        @Args('url') url: string,
        @Args('tags', { type: () => [String], nullable: true }) tags?: string[],
    ): Promise<VideoModel> {
        const apiResponse = await this.videoService.fetchChzzkClip(url);
        return await this.videoService.createFromChzzkApi(apiResponse, url, tags ?? []);
    }

    @Mutation(() => Boolean, { description: '비디오 삭제' })
    @UseGuards(AdminAuthGuard)
    async deleteVideo(
        @Args('id') id: string,
    ): Promise<boolean> {
        return await this.videoService.delete(id);
    }
}