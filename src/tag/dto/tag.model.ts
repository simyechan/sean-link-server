import { Field, ObjectType } from "@nestjs/graphql";
import { CommonModel } from "src/common/dto/common.model";

@ObjectType()
export class TagModel extends CommonModel {
    @Field(() => String, { description: '태그 이름' })
    name: string;
}