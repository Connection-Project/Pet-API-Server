export declare class GetOneBoardObj {
    boardId: number;
    profile: string;
    writer: string;
    type: string;
    title: string;
    content: string;
    images: string[];
    liked: boolean;
    likedCount: number;
    commentCount: number;
    mine: boolean;
    createdAt: string;
}
export declare class GetOneBoardSuccessDto {
    resultCode: number;
    data: GetOneBoardObj;
}
export declare class GetOneBoardFailDto {
    resultCode: number;
    data: any;
}
