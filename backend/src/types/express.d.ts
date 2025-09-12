import { IJwtDecoded } from '../../domain/interfaces/repositories/jwtDecode.repository';

declare global {
  namespace Express {
    interface Request {
      decoded?: IJwtDecoded;
    }
  }
}

export {};