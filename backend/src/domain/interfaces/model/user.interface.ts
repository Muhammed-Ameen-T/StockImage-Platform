import { Document, ObjectId } from "mongoose"

export interface IUser extends Document {
    _id: ObjectId;
    name: string
    email: string
    phoneNumber: string
    password: string
    createdAt: Date;
    updatedAt: Date;
}