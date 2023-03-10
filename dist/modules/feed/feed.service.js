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
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const aws_service_1 = require("../../lib/aws/src/aws.service");
const feed_repository_1 = require("../../repositories/feed.repository");
const feedImage_repository_1 = require("../../repositories/feedImage.repository");
const feedLiked_repository_1 = require("../../repositories/feedLiked.repository");
const hashtag_repository_1 = require("../../repositories/hashtag.repository");
const myPet_repository_1 = require("../../repositories/myPet.repository");
const user_repository_1 = require("../../repositories/user.repository");
const date_1 = require("../../utils/date");
let FeedService = class FeedService {
    constructor(awsService, feedRepository, feedImageRepository, feedLikedRepository, userRepository, hashtagRepository, myPetRepository) {
        this.awsService = awsService;
        this.feedRepository = feedRepository;
        this.feedImageRepository = feedImageRepository;
        this.feedLikedRepository = feedLikedRepository;
        this.userRepository = userRepository;
        this.hashtagRepository = hashtagRepository;
        this.myPetRepository = myPetRepository;
    }
    async create(userId, files, body) {
        try {
            let resultCode = 0;
            const { content, hashtag } = body;
            const user = await this.userRepository.findByKey('id', userId);
            const feed = this.feedRepository.create();
            feed.user = user;
            feed.content = content;
            await this.feedRepository.save(feed);
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const { Key, Location } = await this.awsService.uploadImage(files[i]);
                    const feedImage = this.feedImageRepository.create();
                    feedImage.feed = feed;
                    feedImage.originalName = Key;
                    feedImage.path = Location;
                    await this.feedImageRepository.save(feedImage);
                }
            }
            if (hashtag) {
                for (let i = 0; i < hashtag.length; i++) {
                    const newHashtag = this.hashtagRepository.create();
                    newHashtag.name = hashtag[i];
                    newHashtag.feed = feed;
                    await this.hashtagRepository.save(newHashtag);
                }
            }
            resultCode = 1;
            return { data: { resultCode: resultCode, data: null } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1801, data: null } };
        }
    }
    async getMyFeeds(userId) {
        try {
            const query = this.feedRepository.getQuery();
            const feedWhere = [
                {
                    key: 'u.id = :userId',
                    value: {
                        userId: userId,
                    },
                },
            ];
            const [row, cnt] = await this.feedRepository.findMany(query, feedWhere);
            const items = [];
            for (let i = 0; i < row.length; i++) {
                items[i] = {
                    feedId: row[i].id,
                    image: row[i].image.length > 0 ? row[i].image[0].path : null,
                };
            }
            return { data: { resultCode: 1, data: { items: items, count: cnt } } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1811, data: null } };
        }
    }
    async getfriendFeeds(friendId) {
        try {
            const query = this.feedRepository.getQuery();
            const feedWhere = [
                {
                    key: 'u.id = :userId',
                    value: {
                        userId: friendId,
                    },
                },
            ];
            const [row, cnt] = await this.feedRepository.findMany(query, feedWhere);
            const items = [];
            for (let i = 0; i < row.length; i++) {
                items[i] = {
                    feedId: row[i].id,
                    image: row[i].image[0].path,
                };
            }
            return { data: { resultCode: 1, data: { items: items, count: cnt } } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1811, data: null } };
        }
    }
    async getFeed(userId, feedId) {
        try {
            let resultCode = 0;
            let data = null;
            const query = this.feedRepository.getQuery();
            const feedWhere = [
                {
                    key: 'f.id = :feedId',
                    value: {
                        feedId: feedId,
                    },
                },
            ];
            const feed = await this.feedRepository.findOne(query, feedWhere);
            if (feed) {
                const image = [];
                const hashtag = [];
                let liked = false;
                let profileImage = null;
                for (let i = 0; i < feed.image.length; i++) {
                    image.push(feed.image[i].path);
                }
                if (userId) {
                    const feedLiked = await this.feedLikedRepository.findOne(userId, feedId);
                    if (feedLiked)
                        liked = true;
                }
                for (let i = 0; i < feed.hashtag.length; i++) {
                    hashtag.push(feed.hashtag[i].name);
                }
                const pet = await this.myPetRepository.findAll(userId);
                pet.forEach((o) => {
                    if (o.represent)
                        profileImage = o.imagePath;
                });
                data = {
                    feedId: feed.id,
                    nickName: feed.user.nickName,
                    profileImage: profileImage,
                    image: image,
                    mine: feed.user.id === userId ? true : false,
                    feedLiked: liked,
                    content: feed.content,
                    hashtag: hashtag,
                    commentCount: feed.comment.length,
                    likedCount: await this.feedLikedRepository.getCount(feedId),
                    createdAt: (0, date_1.formatDateParam)(feed.createdAt),
                };
                resultCode = 1;
            }
            else {
                resultCode = 1822;
            }
            return { data: { resultCode: resultCode, data: data } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1821, data: null } };
        }
    }
    async update(userId, feedId, body) {
        try {
            let resultCode = 0;
            const { content } = body;
            const feed = await this.feedRepository.findOneByIdAndUserId(userId, feedId);
            if (feed) {
                if (content && content !== feed.content) {
                    feed.content = content;
                    await this.feedRepository.save(feed);
                }
                resultCode = 1;
            }
            else {
                resultCode = 1832;
            }
            return { data: { resultCode: resultCode, data: null } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1831, data: null } };
        }
    }
    async delete(userId, feedId) {
        try {
            let resultCode = 0;
            const feed = await this.feedRepository.findOneByIdAndUserId(userId, feedId);
            if (feed) {
                await this.feedRepository.delete(feedId, userId);
                resultCode = 1;
            }
            else {
                resultCode = 1842;
            }
            return { data: { resultCode: resultCode, data: null } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1841, data: null } };
        }
    }
    async createLiked(userId, feedId) {
        try {
            const feedLiked = await this.feedLikedRepository.findOne(userId, feedId);
            let liked = false;
            let likedCount = 0;
            if (feedLiked) {
                await this.feedLikedRepository.delete(userId, feedId);
            }
            else {
                const newLiked = this.feedLikedRepository.create();
                newLiked.userId = userId;
                newLiked.feedId = feedId;
                await this.feedLikedRepository.save(newLiked);
                liked = true;
            }
            likedCount = await this.feedLikedRepository.getCount(feedId);
            return { data: { resultCode: 1, data: { liked, likedCount } } };
        }
        catch (err) {
            console.log(err);
            return { data: { resultCode: 1851, data: null } };
        }
    }
};
FeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_service_1.AwsService,
        feed_repository_1.FeedRepository,
        feedImage_repository_1.FeedImageRepository,
        feedLiked_repository_1.FeedLikedRepository,
        user_repository_1.UserRepository,
        hashtag_repository_1.HashTagRepository,
        myPet_repository_1.MyPetRepository])
], FeedService);
exports.FeedService = FeedService;
//# sourceMappingURL=feed.service.js.map