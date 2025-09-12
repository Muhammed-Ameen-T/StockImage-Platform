import { injectable } from 'inversify';
import { UserModel } from '../database/user.model';
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository';
import { IUser } from '../../domain/interfaces/model/user.interface';
import { User } from '../../domain/entities/user.entity';
import { BaseRepository } from './base.repository';
import { FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Repository for user-specific operations.
 * Uses composition to wrap BaseRepository and return domain entities.
 */
@injectable()
export class UserRepository implements IUserRepository {
  private readonly baseRepo: BaseRepository<IUser>;

  constructor() {
    this.baseRepo = new BaseRepository<IUser>(UserModel);
  }

  async find(filter: FilterQuery<IUser>): Promise<User[]> {
    const users = await this.baseRepo.find(filter);
    return users.map(this.toEntity);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.baseRepo.findById(id);
    return user ? this.toEntity(user) : null;
  }

  async create(data: Partial<User>): Promise<User> {
    const created = await this.baseRepo.create({
      name: data.name,
      email: data.email?.toLowerCase(),
      phoneNumber: data.phoneNumber,
      password: data.password,
    });
    return this.toEntity(created);
  }

  async update(id: string, data: UpdateQuery<IUser>): Promise<User> {
    const updated = await this.baseRepo.update(id, data);
    if (!updated) throw new Error('User not found');
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.baseRepo.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean<IUser | null>();
    return user ? this.toEntity(user) : null;
  }

  /**
   * Updates the user's password.
   * @param userId - ID of the user
   * @param hashedPassword - New hashed password
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  private toEntity(model: IUser): User {
    return new User(
      model._id,
      model.name,
      model.email,
      model.phoneNumber,
      model.password,
      model.createdAt,
      model.updatedAt
    );
  }
}
