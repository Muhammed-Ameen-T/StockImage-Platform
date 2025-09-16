import { ReorderImageDTO } from "../../../application/dtos/image.dto";

export interface IReorderImageUseCase {
  execute(dto: ReorderImageDTO): Promise<void>;
}
