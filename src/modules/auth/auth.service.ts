import { RedisCacheService } from './../../cache/redisCache.service';
import { UserRepository } from '../../repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from 'src/lib/jwt/jwt.service';
import { EmailLoginReqDto } from './dto/req/auth.req.dto';
import { User } from 'src/models/User.entity';
import { GenDigestPwd } from 'src/utils/crypto';
import axios from 'axios';
import { RenewTokenReqDto } from './dto/req/renew.req.dto';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private readonly jwtServcie: JwtService,
        private readonly redisCacheService: RedisCacheService,
    ) {}

    async signIn(body: EmailLoginReqDto): Promise<any> {
        try {
            const { email, password } = body;
            const user: User = await this.userRepository.findByKey('email', email);
            let status = 0;
            let resultCode = 0;
            let data = null;
            if (user) {
                // * 비밀번호 검증
                if (GenDigestPwd(password) === user.password) {
                    await this.userRepository.save(user);

                    const { accessToken, refreshToken, accessTokenExpireIn, refreshTokenExpireIn } =
                        this.jwtServcie.getToken(user.id);

                    data = {
                        accessToken: accessToken,
                        accessTokenExpireIn: new Date(accessTokenExpireIn * 1000),
                        refreshToken: refreshToken,
                        refreshTokenExpireIn: new Date(refreshTokenExpireIn * 1000),
                    };

                    // await this.redisCacheService.set(refreshToken, user.id, 604800);

                    status = 200;
                    resultCode = 1;
                } else {
                    // * 비밀번호 틀림
                    status = 202;
                    resultCode = 1103;
                }
            } else {
                // * 유저 계정 없음
                status = 201;
                resultCode = 1102;
            }
            return { status: status, data: { resultCode: resultCode, data: data } };
        } catch (err) {
            console.log(err);
            return { status: 400, data: { resultCode: 1101, data: null } };
        }
    }

    async kakaoCallBack(code: string): Promise<any> {
        try {
            let status = 0;
            let resultCode = 0;
            const response = await axios.post(
                `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_OAUTH_API_KEY}&redirect_url=${process.env.KAKAO_OAUTH_REDIRECT_URL}&code=${code}`,
            );
            const { access_token } = response.data;
            const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const { id, kakao_account } = userInfo.data;
            let data = null;

            const user: User = await this.userRepository.findByKey('accountId', id);
            if (user) {
                const { accessToken, refreshToken, accessTokenExpireIn, refreshTokenExpireIn } =
                    this.jwtServcie.getToken(user.id);

                data = {
                    accessToken: accessToken,
                    accessTokenExpireIn: new Date(accessTokenExpireIn * 1000),
                    refreshToken: refreshToken,
                    refreshTokenExpireIn: new Date(refreshTokenExpireIn * 1000),
                };

                status = 200;
                resultCode = 1;
            } else {
                data = {
                    accountId: id,
                    nickName: kakao_account.profile.nickname,
                    email: kakao_account.email,
                };
                status = 201;
                resultCode = 1112;
            }
            return { status: status, data: { resultCode: resultCode, data: data } };
        } catch (err) {
            console.log(err);
            return { status: 400, data: { resultCode: 1111, data: null } };
        }
    }

    async renewToken(body: RenewTokenReqDto): Promise<any> {
        try {
            let status = 0;
            let resultCode = 0;
            let data = null;
            const { refreshToken } = body;
            const { state, user } = this.jwtServcie.verifyToken(refreshToken);
            if (state) {
                const { accessToken, refreshToken } = this.jwtServcie.getToken(user.userId);
                status = 200;
                resultCode = 1;
                data = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
            } else {
                // ! refreshToken 만료
                status = 403;
                resultCode = 9002;
            }
            return { status: status, data: { resultCode: resultCode, data: data } };
        } catch (err) {
            console.log(err);
            return { status: 400, data: { resultCode: 9001, data: null } };
        }
    }
}
