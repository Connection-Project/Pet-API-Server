import { MyPetRepository } from 'src/repositories/myPet.repository';
import { Module } from '@nestjs/common';
import { CommentService } from './boardComment.service';
import { CommentController } from './boardComment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardComment } from 'src/models/BoardComment.entity';
import { Board } from 'src/models/Board.entity';
import { BoardRepository } from 'src/repositories/board.repository';
import { BoardCommentRepository } from 'src/repositories/boardComment.repository';
import { User } from 'src/models/User.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { BoardCommentReplyRepository } from 'src/repositories/boardCommentReply.repository';
import { BoardCommentReply } from 'src/models/BoardCommentReply.entity';
import { MyPet } from 'src/models/MyPets.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BoardComment, Board, BoardCommentReply, User, MyPet])],
    providers: [
        CommentService,
        BoardRepository,
        BoardCommentRepository,
        BoardCommentReplyRepository,
        UserRepository,
        MyPetRepository,
    ],
    controllers: [CommentController],
})
export class CommentModule {}
