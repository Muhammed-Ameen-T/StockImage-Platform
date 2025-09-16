export class ReorderImageDTO {
  constructor(
    public imageId: string,
    public userId: string,
    public previousOrder?: number,
    public nextOrder?: number
  ) {}
}

export class BulkUploadDTO {
  constructor(
    public userId: string,
    public files: Express.Multer.File[],
    public titles: string[],
    public originalFileNames: string[],
    public mimeTypes: string[],
    public fileSizes: number[]
  ) {}
}

