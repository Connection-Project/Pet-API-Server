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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const aws_service_1 = require("../../lib/aws/src/aws.service");
const user_repository_1 = require("../../repositories/user.repository");
const crypto_1 = require("../../utils/crypto");
let UserService = class UserService {
    constructor(awsService, userRepository) {
        this.awsService = awsService;
        this.userRepository = userRepository;
    }
    async emailSignUp(file, body) {
        try {
            const { email } = body;
            const existUser = await this.userRepository.findByKey('email', email);
            let resultCode = 0;
            if (existUser) {
                resultCode = 1001;
            }
            else {
                let imageKey = null;
                let imagePath = null;
                if (file) {
                    const res = await this.awsService.uploadImage(file);
                    imageKey = res.Key;
                    imagePath = res.Location;
                }
                const createBody = Object.assign({ registType: 'email', imageKey,
                    imagePath }, body);
                const newUser = await this.userRepository.create(createBody);
                await this.userRepository.save(newUser);
                resultCode = 1;
            }
            return { data: { resultCode: resultCode, data: null } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1002, data: null } };
        }
    }
    async socialSignUp(file, body) {
        try {
            const { email } = body;
            const existUser = await this.userRepository.findByKey('email', email);
            let resultCode = 0;
            if (existUser) {
                resultCode = 1001;
            }
            else {
                let imageKey = null;
                let imagePath = null;
                if (file) {
                    const res = await this.awsService.uploadImage(file);
                    imageKey = res.Key;
                    imagePath = res.Location;
                }
                const createBody = Object.assign({ registType: 'kakao', imageKey,
                    imagePath }, body);
                const newUser = this.userRepository.create(createBody);
                await this.userRepository.save(newUser);
                resultCode = 1;
            }
            return { data: { resultCode: resultCode, data: null } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1003, data: null } };
        }
    }
    async getInfo(userId) {
        try {
            const user = await this.userRepository.findByKey('id', userId);
            const data = {
                email: user.email,
                name: user.name,
                nickName: user.nickName,
                phone: user.phone,
                registType: user.registType,
            };
            return { data: { resultCode: 1, data: data } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1011, data: null } };
        }
    }
    async update(userId, file, body) {
        try {
            const { password, name, phone, nickName } = body;
            const user = await this.userRepository.findByKey('id', userId);
            if (password.replace(/ /g, '') !== '') {
                user.password = (0, crypto_1.GenDigestPwd)(password);
            }
            if (name.replace(/ /g, '') !== '')
                user.name = name;
            if (nickName.replace(/ /g, '') !== '')
                user.nickName = nickName;
            if (phone.replace(/ /g, '') !== '')
                user.phone = phone;
            if (file) {
                const res = await this.awsService.uploadImage(file);
                if (res) {
                    this.awsService.s3Delete({
                        Bucket: 'pet-img',
                        Key: user.imageKey,
                    });
                    user.imageKey = res.Key;
                    user.imagePath = res.Location;
                }
                else {
                    common_1.Logger.log('ERROR - S3 Upload Failed');
                }
            }
            await this.userRepository.save(user);
            return { data: { resultCode: 1, data: null } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1021, data: null } };
        }
    }
    async delete(userId) {
        try {
            const user = await this.userRepository.findByKey('id', userId);
            await this.awsService.s3Delete({
                Bucket: 'pet-img',
                Key: user.imageKey,
            });
            await this.userRepository.delete(userId);
            return { data: { resultCode: 1, data: null } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1031, data: null } };
        }
    }
    async getUserRandom() {
        try {
            const user = await this.userRepository.getManyRandomUser();
            const items = [];
            for (let i = 0; i < user.length; i++) {
                let pet = null;
                user[i].pet.forEach((o) => {
                    if (o.represent) {
                        pet = o.breed;
                    }
                });
                items[i] = {
                    userId: user[i].id,
                    breed: user[i].pet.length > 1 ? pet + '외 ' + (user[i].pet.length - 1) : pet,
                    image: user[i].imagePath,
                };
            }
            return { data: { resultCode: 200, data: items } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1041, data: null } };
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_service_1.AwsService, user_repository_1.UserRepository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map