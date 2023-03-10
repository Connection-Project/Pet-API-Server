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
exports.MyPetRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const MyPets_entity_1 = require("../models/MyPets.entity");
const typeorm_2 = require("typeorm");
let MyPetRepository = class MyPetRepository {
    constructor(myPetRepository) {
        this.myPetRepository = myPetRepository;
    }
    create(body) {
        const myPet = this.myPetRepository.create();
        myPet.user = body.user;
        myPet.represent = body.represent;
        myPet.name = body.name;
        myPet.breed = body.breed;
        myPet.gender = body.gender;
        myPet.birthDay = body.birthDay !== '' ? new Date(body.birthDay) : new Date();
        myPet.togetherDay = body.togetherDay !== '' ? new Date(body.togetherDay) : new Date();
        myPet.imageKey = body.imageKey;
        myPet.imagePath = body.imagePath;
        return myPet;
    }
    async findAll(userId) {
        return await this.myPetRepository
            .createQueryBuilder('mp')
            .innerJoinAndSelect('mp.user', 'u')
            .where('u.id = :userId', { userId: userId })
            .orderBy('mp.id', 'DESC')
            .getMany();
    }
    async findOneById(userId, myPetId) {
        return await this.myPetRepository
            .createQueryBuilder('mp')
            .innerJoinAndSelect('mp.user', 'u')
            .where('mp.id = :myPetId', { myPetId: myPetId })
            .andWhere('mp.userId = :userId', { userId: userId })
            .getOne();
    }
    async delete(myPetId, userId) {
        await this.myPetRepository
            .createQueryBuilder('mp')
            .delete()
            .where('id = :myPetId', { myPetId: myPetId })
            .andWhere('userId = :userId', { userId: userId })
            .execute();
    }
    async getRepresentPetOne(userId) {
        return await this.myPetRepository
            .createQueryBuilder('mp')
            .innerJoinAndSelect('mp.user', 'u')
            .where('u.id = :userId', { userId: userId })
            .andWhere('mp.represent = :represent', { represent: true })
            .getOne();
    }
    async save(myPet) {
        await this.myPetRepository.save(myPet);
    }
};
MyPetRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(MyPets_entity_1.MyPet)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MyPetRepository);
exports.MyPetRepository = MyPetRepository;
//# sourceMappingURL=myPet.repository.js.map