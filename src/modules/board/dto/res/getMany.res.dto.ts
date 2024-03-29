import { ApiProperty } from '@nestjs/swagger';

export class GetManyBoardItemObj {
    @ApiProperty()
    boardId: number;

    @ApiProperty()
    profile: string;

    @ApiProperty()
    writer: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    liked: boolean;

    @ApiProperty()
    likedCount: number;

    @ApiProperty()
    commentCount: number;

    @ApiProperty()
    createdAt: string;
}

export class GetManyBoardObj {
    @ApiProperty({ type: GetManyBoardItemObj })
    items: GetManyBoardItemObj;

    @ApiProperty()
    count: number;
}

export class GetManyBoardSuccessDto {
    @ApiProperty({ default: 1 })
    resultCode: number;

    @ApiProperty({ type: GetManyBoardObj })
    data: GetManyBoardObj;
}

export class GetManyBoardFailDto {
    @ApiProperty({ default: 1411 })
    resultCode: number;

    @ApiProperty({ default: null })
    data: any;
}
