import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PlaylistInput {
    @Field(() => String, { description: '플레이리스트 이름' })
    name: string;
}