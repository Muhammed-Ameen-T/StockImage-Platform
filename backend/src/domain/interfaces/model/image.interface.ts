import { Document, Types } from "mongoose"

export interface IImage extends Document {
    userId: Types.ObjectId
    title: string
    fileName: string
    fileSize: number
    mimeType: string
    url: string
    order: number
    createdAt: Date;
    updatedAt: Date;
}
