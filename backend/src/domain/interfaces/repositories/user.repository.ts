import { User } from "../../entities/user.entity"

export interface IUserRepository {
  find(filter: object): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}
