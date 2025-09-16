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
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const user_model_1 = require("../database/user.model");
const user_entity_1 = require("../../domain/entities/user.entity");
const base_repository_1 = require("./base.repository");
/**
 * Repository for user-specific operations.
 * Uses composition to wrap BaseRepository and return domain entities.
 */
let UserRepository = class UserRepository {
    constructor() {
        this.baseRepo = new base_repository_1.BaseRepository(user_model_1.UserModel);
    }
    async find(filter) {
        const users = await this.baseRepo.find(filter);
        return users.map(this.toEntity);
    }
    async findById(id) {
        const user = await this.baseRepo.findById(id);
        return user ? this.toEntity(user) : null;
    }
    async create(data) {
        const created = await this.baseRepo.create({
            name: data.name,
            email: data.email?.toLowerCase(),
            phoneNumber: data.phoneNumber,
            password: data.password,
        });
        return this.toEntity(created);
    }
    async update(id, data) {
        const updated = await this.baseRepo.update(id, data);
        if (!updated)
            throw new Error('User not found');
        return this.toEntity(updated);
    }
    async delete(id) {
        await this.baseRepo.delete(id);
    }
    async findByEmail(email) {
        const user = await user_model_1.UserModel.findOne({ email: email.toLowerCase() }).lean();
        return user ? this.toEntity(user) : null;
    }
    /**
     * Updates the user's password.
     * @param userId - ID of the user
     * @param hashedPassword - New hashed password
     */
    async updatePassword(userId, hashedPassword) {
        await user_model_1.UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
    }
    toEntity(model) {
        return new user_entity_1.User(model._id, model.name, model.email, model.phoneNumber, model.password, model.createdAt, model.updatedAt);
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserRepository);
