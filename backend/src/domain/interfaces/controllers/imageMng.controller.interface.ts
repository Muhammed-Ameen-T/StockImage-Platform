import { Request, Response, NextFunction } from 'express';

export interface IImageController {
  bulkUpload(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteImage(req: Request, res: Response, next: NextFunction): Promise<void>;
  findUserImages(req: Request, res: Response, next: NextFunction): Promise<void>;
  editImage(req: Request, res: Response, next: NextFunction): Promise<void>;
}
