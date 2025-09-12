export interface IBulkUploadImagesUseCase {
  execute(userId: string, images: { title: string; url: string }[]): Promise<void>;
}
