import { FriendRepository } from 'src/repositories/friend.repository';
import { MyPetRepository } from 'src/repositories/myPet.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { ReturnResDto } from '../common/dto/return/return.res.dto';
import { CreatefriendReqDto } from './dto/req/create.req.dto';
export declare class FriendService {
    private readonly friendRepository;
    private readonly userRepository;
    private readonly myPetRepository;
    constructor(friendRepository: FriendRepository, userRepository: UserRepository, myPetRepository: MyPetRepository);
    create(userId: number, body: CreatefriendReqDto): Promise<ReturnResDto>;
    requestConfirm(userId: number, friendId: number): Promise<ReturnResDto>;
    getRequests(userId: number): Promise<ReturnResDto>;
    delete(userId: number, friendId: number): Promise<ReturnResDto>;
}
