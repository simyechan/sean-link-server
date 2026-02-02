import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TagCreateInput {
    @Field(() => String, { description: '태그 이름' })
    name: string;
}