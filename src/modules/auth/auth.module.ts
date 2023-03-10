import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../models/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from 'src/lib/jwt/jwt.service';
import { AccessTokenStrategy } from 'src/lib/jwt/strategies/accessToken.strategy';
import { RedisCacheModule } from 'src/cache/redisCache.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), RedisCacheModule],
    controllers: [AuthController],
    providers: [AuthService, UserRepository, JwtService, AccessTokenStrategy],
})
export class AuthModule {}
