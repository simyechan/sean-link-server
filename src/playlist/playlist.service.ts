import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlaylistEntity } from "./playlist.entity";
import { Repository } from "typeorm";
import { TagService } from "src/tag/tag.service";
import { TagEntity } from "src/tag/tag.entity";
import { VideoService } from "src/video/video.service";
import { PlaylistVideoEntity } from "./playlist-video.entity";

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(PlaylistEntity) private readonly repository: Repository<PlaylistEntity>,
        @InjectRepository(PlaylistVideoEntity) private readonly playlistVideoRepository: Repository<PlaylistVideoEntity>,
        private readonly tagService: TagService,
        private readonly videoService: VideoService,
    ) {}

    async findAll(): Promise<PlaylistEntity[]> {
        return await this.repository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: string): Promise<PlaylistEntity | null> {
        return await this.repository.findOne({
            where: { id },
        });
    }

    async create(
        playlistInput: Partial<PlaylistEntity>,
        videoIds?: string[],
        tagNames?: string[],
    ): Promise<PlaylistEntity | null> {
    let tags: TagEntity[] = [];

    if (tagNames?.length) {
        tags = await this.resolveTags(tagNames);
    }

    const playlist = await this.repository.save(
        this.repository.create({
            name: playlistInput.name,
            tags,
        }),
    );

    if (videoIds?.length) {
        const playlistVideos = videoIds.map((videoId, index) =>
            this.playlistVideoRepository.create({
                playlist,
                videoId,
                order: index + 1,
            }),
        );

        await this.playlistVideoRepository.save(playlistVideos);
    }

    return await this.repository.findOne({
        where: { id: playlist.id },
        relations: ['videos', 'videos.video', 'tags'],
    });
}

    async addVideoToPlaylist(
        playlistId: string,
        videoId: string,
    ): Promise<PlaylistEntity> {
        const playlist = await this.repository.findOne({
            where: { id: playlistId },
            relations: ['videos'],
        });

        if (!playlist) {
            throw new Error('플레이리스트를 찾을 수 없습니다.');
        }

        const video = await this.videoService.findById(videoId);
        if (!video) {
            throw new Error('영상을 찾을 수 없습니다.');
        }

        const maxOrder = playlist.videos.reduce((max, pv) => pv.order > max ? pv.order : max, 0);

        playlist.videos.push({
            videoId: video.id,
            order: maxOrder + 1,
        } as any);

        await this.repository.save(playlist);
        return playlist;
    }

    async delete(id: string): Promise<boolean> {
        const playlist = await this.repository.findOne({
            where: { id },
        });

        if (!playlist) {
            throw new Error('플레이리스트를 찾을 수 없습니다.');
        }

        await this.repository.remove(playlist);
        return true;
    }

    private async resolveTags(tagNames: string[]): Promise<TagEntity[]> {
        const tags: TagEntity[] = [];

        for (const tagName of tagNames) {
            const tag = await this.tagService.findByName(tagName);
            if (!tag) {
                tags.push(await this.tagService.create({ name: tagName }));
            } else {
                tags.push(tag);
            }
        }

        return tags;
    }
}