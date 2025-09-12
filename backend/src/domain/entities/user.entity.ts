import { ObjectId } from 'mongoose';

export class User {
  constructor(
    public _id: ObjectId | null,
    public name: string,
    public email: string,
    public phoneNumber: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
