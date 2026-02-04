import { Field, ObjectType } from "@nestjs/graphql";
import { CommonModel } from "src/common/dto/common.model";

@ObjectType()
export class PlaylistModel extends CommonModel {
    @Field(() => String, { description: '플레이리스트 이름' })
    name: string;

    @Field(() => Number, { description: '플레이리스트 조회수' })
    viewCount: number;
}