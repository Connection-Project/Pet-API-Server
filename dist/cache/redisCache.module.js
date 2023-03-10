"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheModule = void 0;
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
const common_1 = require("@nestjs/common");
const redisCache_service_1 = require("./redisCache.service");
let RedisCacheModule = class RedisCacheModule {
};
RedisCacheModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_1.CacheModule.register({
                useFactory: () => ({
                    store: cache_manager_redis_store_1.redisStore,
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT),
                    ttl: 20,
                }),
            }),
        ],
        providers: [redisCache_service_1.RedisCacheService],
        exports: [redisCache_service_1.RedisCacheService],
    })
], RedisCacheModule);
exports.RedisCacheModule = RedisCacheModule;
//# sourceMappingURL=redisCache.module.js.map