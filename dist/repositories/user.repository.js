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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_entity_1 = require("../models/User.entity");
const crypto_1 = require("../utils/crypto");
const typeorm_2 = require("typeorm");
let UserRepository = class UserRepository {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    create(body) {
        const user = this.userRepository.create();
        user.email = body.email;
        if (body.password)
            user.password = (0, crypto_1.GenDigestPwd)(body.password);
        user.name = body.name;
        user.nickName = body.nickName;
        user.phone = body.phone;
        user.registType = body.registType;
        user.imageKey = body.imageKey;
        user.imagePath = body.imagePath;
        if (body.accountId)
            user.accountId = body.accountId;
        return user;
    }
    async findByKey(key, value) {
        return await this.userRepository.createQueryBuilder('u').where(`${key} = '${value}'`).getOne();
    }
    async delete(userId) {
        await this.userRepository
            .createQueryBuilder('u')
            .delete()
            .where('id = :id', { id: userId })
            .execute();
    }
    async save(user) {
        await this.userRepository.save(user);
    }
    getQuery() {
        return this.userRepository.createQueryBuilder('u');
    }
    async getManyRandomUser(query, addWhere) {
        for (let i = 0; i < addWhere.length; i++) {
            query.where(addWhere[i].key, addWhere[i].value);
        }
        query.orderBy('RAND()');
        query.limit(6);
        return query.getMany();
    }
};
UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map