export interface IDeleteImageUseCase {
  execute(imageId: string): Promise<void>;
}
