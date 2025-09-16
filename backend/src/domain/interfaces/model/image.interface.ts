import { ObjectId } from "mongoose"
import { Document, Types } from "mongoose"

export interface IImage extends Document {
    _id: ObjectId
    userId: Types.ObjectId
    title: string
    originalFileName: string
    fileSize: number
    mimeType: string
    url: string
    order: number
    createdAt: Date;
    updatedAt: Date;
}
