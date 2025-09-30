import { IImage } from "../model/image.interface";

export interface IFindUserImagesUseCase {
  execute(params: {
    userId: string
    skip?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<{ images: IImage[]; total: number }>;
}
