import { registerEnumType } from "@nestjs/graphql";

export enum Platform {
    YOUTUBE = 'YOUTUBE',
    CHZZK = 'CHZZK',
}

registerEnumType(Platform, {
    name: 'Platform',
});