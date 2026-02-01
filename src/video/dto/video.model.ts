import { Field, ObjectType } from "@nestjs/graphql";
import { CommonModel } from "src/common/dto/common.model";
import { Platform } from "src/common/enums/platform.enum";

@ObjectType()
export class VideoModel extends CommonModel{
    @Field(() => String, { description: '영상 id' } )
    videoId?: string;

    @Field(() => String, { nullable: true, description: '영상 url' } )
    videoUrl?: string;

    @Field(() => String, { nullable: true, description: '영상 제목' } )
    videoTitle?: string;

    @Field(() => String, { nullable: true, description: '썸네일' } )
    thumbnail?: string;

    @Field(() => Number, { nullable: true, description: '영상 길이' } )
    duration?: number;

    @Field(() => String, { nullable: true, description: '채널 id' } )
    channelId?: string;

    @Field(() => String, { nullable: true, description: '채널 이름' } )
    channelName?: string;

    @Field(() => String, { nullable: true, description: '채널 이미지 url' } )
    channelImageUrl?: string;

    @Field(() => Number, { description: '조회수' } )
    viewCount: number;

    @Field(() => Platform, { nullable: true, description: '플랫폼' } )
    platform?: Platform;
}