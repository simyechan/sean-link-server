import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Videoetity } from "./video.entity";
import { Repository } from "typeorm";
import { Platform } from "src/common/enums/platform.enum";
import { TagEntity } from "src/tag/tag.entity";
import { VideoViewLogEntity } from "./video-view-log.entity";

export interface ChzzkClipResponse {
  content: {
    clipUID: string;
    clipTitle: string;
    thumbnailImageUrl: string;
    duration: number;
    optionalProperty?: {
      ownerChannel?: {
        channelId: string;
        channelName: string;
        channelImageUrl: string;
      };
    };
  };
}

export function mapChzzkResponseToVideoEntity(
  response: ChzzkClipResponse,
  videoUrl: string,
): Partial<Videoetity> {
  const content = response.content;
  const channel = content.optionalProperty?.ownerChannel;

  return {
    videoId: content.clipUID,
    videoUrl,
    videoTitle: content.clipTitle,
    thumbnail: content.thumbnailImageUrl,
    duration: content.duration,
    channelId: channel?.channelId ?? null,
    channelName: channel?.channelName ?? null,
    channelImageUrl: channel?.channelImageUrl ?? null,
    viewCount: 0,
    platform: Platform.CHZZK,
  };
}

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Videoetity) private readonly repository: Repository<Videoetity>,
        @InjectRepository(VideoViewLogEntity) private readonly viewLogRepository: Repository<VideoViewLogEntity>,
        @InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>,
    ) {}

    async incrementViewCount(videoId: string, ip: string): Promise<void> {
        const today = new Date();
        today.setHours(0, 0, 0, 0)

        const exists = await this.viewLogRepository.findOne({
            where: {
                videoId,
                ip,
                viewDate: today,
            },
        });

        if (exists) {
            return;
        }

        await this.viewLogRepository.manager.transaction(async (manager) => {
            await manager.increment(
                Videoetity,
                { id: videoId },
                'viewCount',
                1,
            );

            await manager.save(VideoViewLogEntity, {
                videoId,
                ip,
                viewDate: today,
            });
        });
    }

    async fetchChzzkClip(clipUrl: string) {
        const clipUID = this.extractClipUID(clipUrl);

        const response = await fetch(
            `https://api.chzzk.naver.com/service/v1/clips/${clipUID}`,
            {
                headers: {
                'User-Agent': 'Mozilla/5.0',
                },
            }
        );

        if (!response.ok) {
            throw new Error('치지직 클립 정보를 가져오지 못했습니다.');
        }

        const json = await response.json();
        return json.content;
    }

    private extractClipUID(url: string): string {
        const match = url.match(/clips\/([a-zA-Z0-9]+)/);
        if (!match) {
            throw new Error('유효하지 않은 치지직 클립 URL입니다.');
        }
        return match[1];
    }

    async findAll(): Promise<Videoetity[]> {
        return await this.repository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: string): Promise<Videoetity> {
        const video = await this.repository.findOneBy({ id });
        if (!video) {
            throw new NotFoundException('비디오를 찾을 수 없습니다.');
        }

        return video;
    }

    async createFromChzzkApi(
        apiResponse: ChzzkClipResponse,
        videoUrl: string,
        tagNames: string[] = [],
    ): Promise<Videoetity> {
        const videoId = apiResponse.content.clipUID;

        let exists = await this.repository.findOne({
            where: { videoId },
            withDeleted: true,
        });
       
        if (exists) {
            if (!exists.deletedAt) {
                throw new BadRequestException("이미 등록된 영상입니다.");
            }
            exists.deletedAt = null;
        } else {
            exists = this.repository.create({
                ...mapChzzkResponseToVideoEntity(apiResponse, videoUrl),
            });
        }

        const tags = await Promise.all(
            tagNames.map(async (name) => {
                const trimmed = name.trim();
                if (!trimmed) return null;

                let tag = await this.tagRepository.findOne({
                    where: { name: trimmed },
                });

                if (!tag) {
                    tag = this.tagRepository.create({ name: trimmed });
                    tag = await this.tagRepository.save(tag);
                }

                return tag;
            }),
        );

        const video = this.repository.create({
            ...mapChzzkResponseToVideoEntity(apiResponse, videoUrl),
            tags: tags.filter(
                (tag): tag is TagEntity => tag !== null
            ),
        });

        return this.repository.save(video);
    }

    async delete(id: string): Promise<boolean> {
        const video = await this.repository.findOne({ where: { id } });

        if (!video) {
            throw new NotFoundException('삭제할 비디오를 찾을 수 없습니다.');
        }

        await this.repository.softDelete(video.id);
        return true;
    }
}