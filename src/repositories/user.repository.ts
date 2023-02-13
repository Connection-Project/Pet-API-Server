import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/User.entity';
import { CreateTypesDto } from 'src/modules/user/dto/types/create.types';
import { GenDigestPwd } from 'src/utils/crypto';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    create(body: CreateTypesDto): User {
        const user: User = this.userRepository.create();
        user.email = body.email;
        if (body.password) user.password = GenDigestPwd(body.password);
        user.name = body.name;
        user.nickName = body.nickName;
        user.phone = body.phone;
        user.registType = body.registType;
        user.imageKey = body.imageKey;
        user.imagePath = body.imagePath;
        if (body.accountId) user.accountId = body.accountId;
        return user;
    }

    async findByKey(key: string, value: string | number): Promise<User> {
        return await this.userRepository.createQueryBuilder('u').where(`${key} = '${value}'`).getOne();
    }

    async delete(userId: number): Promise<void> {
        await this.userRepository
            .createQueryBuilder('u')
            .delete()
            .where('id = :id', { id: userId })
            .execute();
    }

    async save(user: User): Promise<void> {
        await this.userRepository.save(user);
    }

    async getManyRandomUser(): Promise<User[]> {
        return this.userRepository
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.pet', 'p')
            .orderBy('RANDOM()')
            .limit(4)
            .getMany();
    }
}
