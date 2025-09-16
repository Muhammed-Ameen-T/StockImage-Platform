import { BulkUploadDTO } from "../../../application/dtos/image.dto";

export interface IBulkUploadImagesUseCase {
  execute(dto: BulkUploadDTO): Promise<void>;
}