export interface IEditImageUseCase {
  execute(imageId: string, updates: { title?: string; url?: string; order?: number }): Promise<void>;
}
