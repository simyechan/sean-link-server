import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PlaylistModel } from "./dto/playlist.model";
import { PlaylistService } from "./playlist.service";
import { PlaylistInput } from "./dto/playlist.input";
import { UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/common/guards/admin-auth.guards";

@Resolver(() => PlaylistModel)
export class PlaylistResolver {
    constructor(
        private playlistService: PlaylistService,
    ) {}

    @Query(() => [PlaylistModel])
    async getAllPlaylists(): Promise<PlaylistModel[]> {
        return this.playlistService.findAll();
    }

    @Query(() => PlaylistModel)
    async getPlaylistById(
        @Args('id') id: string,
    ): Promise<PlaylistModel | null> {
        return this.playlistService.findById(id);
    }

    @Mutation(() => PlaylistModel, { nullable: true })
    async createPlaylist(
        @Args('data') data: PlaylistInput,
        @Args('videoIds', { type: () => [String], nullable: true }) videoIds?: string[],
        @Args('tagNames', { type: () => [String], nullable: true }) tagNames?: string[],
    ): Promise<PlaylistModel | null> {
        return this.playlistService.create(data, videoIds, tagNames);
    }

    @Mutation(() => PlaylistModel)
    async addVideoToPlaylist(
        @Args('playlistId') playlistId: string,
        @Args('videoId') videoId: string,
    ): Promise<PlaylistModel> {
        return this.playlistService.addVideoToPlaylist(playlistId, videoId);
    }

    @Mutation(() => Boolean)
    @UseGuards(AdminAuthGuard)
    async removeVideoFromPlaylist(
        @Args('playlistId') playlistId: string,
    ): Promise<boolean> {
        return this.playlistService.delete(playlistId);
    }
}