import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IJwtDecoded } from '../../domain/interfaces/repositories/jwtDecode.repository';
import { CustomError } from '../../utils/errors/custom.error';
import { HttpResCode, HttpResMsg } from '../../utils/constants/httpResponseCode.utils';
import { env } from '../../config/env.config';
import { JwtService } from '../../infrastructure/services/jwt.service';
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository';
import { TYPES } from '../../core/types';
import { container } from '../../core/inversify.config';


const jwtService = container.get<JwtService>(TYPES.JwtService); 

declare global {
  namespace Express {
    interface Request {
      decoded?: IJwtDecoded;
    }
  }
}

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      throw new CustomError(HttpResMsg.NO_ACCESS_TOKEN, HttpResCode.UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as IJwtDecoded;
      req.decoded = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          throw new CustomError(HttpResMsg.REFRESH_TOKEN_REQUIRED, HttpResCode.UNAUTHORIZED);
        }

        try {
          const decodedRefresh = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as IJwtDecoded;

          const userRepository = container.get<IUserRepository>(TYPES.UserRepository); 
          const user = await userRepository.findById(decodedRefresh.userId);

          if (!user || !user._id) {
            throw new CustomError(HttpResMsg.USER_NOT_FOUND, HttpResCode.UNAUTHORIZED);
          }

          const newAccessToken = jwtService.generateAccessToken(user._id.toString());
          res.setHeader('x-access-token', newAccessToken);

          req.decoded = decodedRefresh;
          next();
        } catch (refreshError) {
          console.error('Refresh token error:', refreshError);
          throw new CustomError(
            HttpResMsg.INVALID_OR_EXPIRED_REFRESH_TOKEN,
            HttpResCode.UNAUTHORIZED,
          );
        }
      } else {
        throw new CustomError(HttpResMsg.INVALID_ACCESS_TOKEN, HttpResCode.UNAUTHORIZED);
      }
    }
  } catch (error) {
    next(error);
  }
};
