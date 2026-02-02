import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AdminSignupInput {
    @Field(() => String)
    loginId: string;

    @Field(() => String)
    password: string;
}

@InputType()
export class AdminLoginInput {
    @Field(() => String)
    loginId: string;

    @Field(() => String)
    password: string;
}