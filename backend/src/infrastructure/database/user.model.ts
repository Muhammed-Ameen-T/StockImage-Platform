import { IUser } from "../../domain/interfaces/model/user.interface";
import { Schema, model } from "mongoose"

const userSchema = new Schema<IUser>(
    {
        name: String,
        email: String,
        phoneNumber: String,
        password: String,
    }, 
    { timestamps: true },
);

export const UserModel = model<IUser>("User", userSchema)