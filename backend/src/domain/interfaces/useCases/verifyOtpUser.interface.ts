import { AuthResponseDTO, VerifyOtpDTO } from "../../../application/dtos/auth.dto";

export interface IVerifyOtpUseCase {
  execute(dto: VerifyOtpDTO): Promise<AuthResponseDTO>;
}
