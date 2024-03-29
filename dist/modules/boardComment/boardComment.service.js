"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const board_repository_1 = require("../../repositories/board.repository");
const boardComment_repository_1 = require("../../repositories/boardComment.repository");
const boardCommentReply_repository_1 = require("../../repositories/boardCommentReply.repository");
const myPet_repository_1 = require("../../repositories/myPet.repository");
const user_repository_1 = require("../../repositories/user.repository");
const date_1 = require("../../utils/date");
let CommentService = class CommentService {
    constructor(boardCommentRepository, boardCommentReplyRepository, boardRepository, userRepository, myPetRepository) {
        this.boardCommentRepository = boardCommentRepository;
        this.boardCommentReplyRepository = boardCommentReplyRepository;
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
        this.myPetRepository = myPetRepository;
    }
    async create(userId, body) {
        try {
            let resultCode = 0;
            const { content, boardId } = body;
            const query = this.boardRepository.getQuery();
            const boardWhere = [
                {
                    key: 'b.id = :boardId',
                    value: {
                        boardId: boardId,
                    },
                },
            ];
            const board = await this.boardRepository.findOne(query, boardWhere);
            if (!board) {
                resultCode = 1502;
            }
            else {
                const user = await this.userRepository.findByKey('id', userId);
                const boardComment = this.boardCommentRepository.create();
                boardComment.board = board;
                boardComment.user = user;
                boardComment.content = content;
                await this.boardCommentRepository.save(boardComment);
                resultCode = 1;
            }
            return { data: { resultCode: resultCode, data: null } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1501, data: null } };
        }
    }
    async getBoardComments(userId, boardId) {
        try {
            const boardComment = await this.boardCommentRepository.findManyByBoardId(boardId);
            const items = [];
            for (let i = 0; i < boardComment.length; i++) {
                let commentMine = false;
                if (userId && userId === boardComment[i].user.id)
                    commentMine = true;
                const commentUserPet = await this.myPetRepository.getRepresentPetOne(boardComment[i].user.id);
                const reply = [];
                const commentReply = await this.boardCommentReplyRepository.findManyByCommentId(boardComment[i].id);
                for (let j = 0; j < commentReply.length; j++) {
                    let replyMine = false;
                    if (userId && userId === commentReply[j].user.id)
                        replyMine = true;
                    const replyUserPet = await this.myPetRepository.getRepresentPetOne(commentReply[j].user.id);
                    reply[j] = {
                        replyId: commentReply[j].id,
                        profile: replyUserPet ? replyUserPet.imagePath : null,
                        writer: commentReply[j].user.nickName,
                        content: commentReply[j].content,
                        mine: replyMine,
                        createdAt: (0, date_1.formatDateParam)(commentReply[j].createdAt),
                    };
                }
                items[i] = {
                    commentId: boardComment[i].id,
                    profile: commentUserPet ? commentUserPet.imagePath : null,
                    writer: boardComment[i].user.nickName,
                    content: boardComment[i].content,
                    mine: commentMine,
                    reply: reply,
                    createdAt: (0, date_1.formatDateParam)(boardComment[i].createdAt),
                };
            }
            return { status: 200, data: { resultCode: 1, data: { items: items } } };
        }
        catch (err) {
            console.log(err);
            return { status: 401, data: { resultCode: 1511, data: null } };
        }
    }
    async update(userId, commentId, body) {
        try {
            let status = 0;
            let resultCode = 0;
            const { content } = body;
            const boardComment = await this.boardCommentRepository.findOneByIdAndUserId(commentId, userId);
            if (boardComment) {
                if (content !== '' && content !== boardComment.content) {
                    boardComment.content = content;
                    await this.boardCommentRepository.save(boardComment);
                }
                status = 200;
                resultCode = 1;
            }
            else {
                status = 201;
                resultCode = 1522;
            }
            return { status: status, data: { resultCode: resultCode, data: null } };
        }
        catch (err) {
            console.log(err);
            return { status: 401, data: { resultCode: 1521, data: null } };
        }
    }
    async delete(userId, commentId) {
        try {
            let status = 0;
            let resultCode = 0;
            const boardComment = await this.boardCommentRepository.findOneByIdAndUserId(commentId, userId);
            if (boardComment) {
                await this.boardCommentRepository.delete(userId, commentId);
                status = 200;
                resultCode = 1;
            }
            else {
                status = 201;
                resultCode = 1532;
            }
            return { status: status, data: { resultCode: resultCode, data: null } };
        }
        catch (err) {
            console.log(err);
            return { status: 401, data: { resultCode: 1531, data: null } };
        }
    }
};
CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [boardComment_repository_1.BoardCommentRepository,
        boardCommentReply_repository_1.BoardCommentReplyRepository,
        board_repository_1.BoardRepository,
        user_repository_1.UserRepository,
        myPet_repository_1.MyPetRepository])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=boardComment.service.js.map