import { Field, ObjectType } from "@nestjs/graphql";
import { CommonModel } from "src/common/dto/common.model";

@ObjectType()
export class AdminModel extends CommonModel {
    @Field(() => String)
    loginId: string;
}

@ObjectType()
export class AdminLoginResponse {
    @Field()
    accessToken: string;
}