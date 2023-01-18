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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_dto_1 = require("./dto/req/create.dto");
const swagger_1 = require("@nestjs/swagger");
const result_res_dto_1 = require("../common/dto/res/result.res.dto");
const create_res_dto_1 = require("./dto/res/create.res.dto");
const getInfo_res_dto_1 = require("./dto/res/getInfo.res.dto");
const update_res_dto_1 = require("./dto/res/update.res.dto");
const update_dto_1 = require("./dto/req/update.dto");
const delete_res_dto_1 = require("./dto/res/delete.res.dto");
const accessToken_guard_1 = require("../../lib/jwt/guards/accessToken.guard");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async emailSignUp(body) {
        return this.userService.emailSignUp(body);
    }
    async getInfo(req) {
        return this.userService.getInfo(req.user['userId']);
    }
    async update(req, body) {
        return this.userService.update(req.user['userId'], body);
    }
    async delete(req) {
        return this.userService.delete(req.user['userId']);
    }
};
__decorate([
    (0, common_1.Post)('signUp/email'),
    (0, swagger_1.ApiOperation)({ summary: '이메일 회원가입' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: result_res_dto_1.ResultSuccessDto, description: '로그인 성공' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: create_res_dto_1.ExistUserDto, description: '이미 존재 하는 계정' }),
    (0, swagger_1.ApiResponse)({ status: 401, type: create_res_dto_1.EmailSignInFailDto, description: '로그인 실패' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.RegistUserReqDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "emailSignUp", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Get)('info'),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '유저 정보' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: getInfo_res_dto_1.getInfoSuccessDto, description: '유저 정보 호출 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, type: getInfo_res_dto_1.getInfoFailDto, description: '유저 정보 호출 실패' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getInfo", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Patch)('update'),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '유저 정보 수정' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: result_res_dto_1.ResultSuccessDto, description: '유저 정보 수정 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, type: update_res_dto_1.UpdateUserFailDto, description: '유저 정보 수정 실패' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_dto_1.UpdateUserReqDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Delete)('delete'),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '회원 탈퇴' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: result_res_dto_1.ResultSuccessDto, description: '회원 탈퇴 성공' }),
    (0, swagger_1.ApiResponse)({ status: 401, type: delete_res_dto_1.WithdrawUserFailDto, description: '회원 탈퇴 실패' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
UserController = __decorate([
    (0, swagger_1.ApiTags)('유저 정보'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map