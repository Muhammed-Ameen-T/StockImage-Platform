import { ChangePasswordDTO } from "../../../application/dtos/auth.dto";

export interface IChangePasswordUseCase {
  execute(dto: ChangePasswordDTO): Promise<void>;
}
