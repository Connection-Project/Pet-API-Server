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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/req/auth.dto");
const signIn_res_dto_1 = require("./dto/res/signIn.res.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signInByEmail(body) {
        return await this.authService.signIn(body);
    }
};
__decorate([
    (0, common_1.Post)('email/signIn'),
    (0, swagger_1.ApiOperation)({ summary: '로그인' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: signIn_res_dto_1.EmailSignInSuccessDto, description: '로그인 성공' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: signIn_res_dto_1.NotFoundUserDto, description: '계정 없음' }),
    (0, swagger_1.ApiResponse)({ status: 202, type: signIn_res_dto_1.InvalidPasswordDto, description: '비밀번호 틀림' }),
    (0, swagger_1.ApiResponse)({ status: 401, type: signIn_res_dto_1.EmailSignInFailDto, description: '로그인 실패' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.EmailLoginReqDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signInByEmail", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('유저 인증'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map