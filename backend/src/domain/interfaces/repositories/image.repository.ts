import { IImage } from '../model/image.interface';

export interface IImageRepository { 
  addMany(images: Partial<IImage>[]): Promise<IImage[]>;
  deleteById(imageId: string): Promise<void>;
  findByUser(userId: string): Promise<IImage[]>;
  updateOrder(imageId: string, newOrder: number): Promise<IImage>;
  findUserImages(params: {
    userId: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ images: IImage[]; totalCount: number }>;
  updateImage(imageId: string, updates: Partial<{ title: string; url: string; order: number }>): Promise<IImage | null>;
  findSurroundingImages( userId: string, previousOrder?: number, nextOrder?: number ): Promise<IImage[]>;
  findMaxOrder(userId: string): Promise<number>;
}
