export interface IEditImageUseCase {
  execute(imageId: string, updates: {
    title: string
    file?: Express.Multer.File
    originalFileName?: string
    mimeType?: string
    fileSize?: number
  }): Promise<void>;
}
