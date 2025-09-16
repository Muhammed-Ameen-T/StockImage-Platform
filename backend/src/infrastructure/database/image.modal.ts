import { IImage } from "../../domain/interfaces/model/image.interface"
import { Schema, model } from "mongoose"

const imageSchema = new Schema<IImage>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        title: String,
        originalFileName: String,
        fileSize: Number,
        mimeType: String,
        url: String,
        order: Number
    }, 
    { timestamps: true },
)

export const ImageModel = model<IImage>("Image", imageSchema)