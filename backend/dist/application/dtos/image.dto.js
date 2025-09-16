"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUploadDTO = exports.ReorderImageDTO = void 0;
class ReorderImageDTO {
    constructor(imageId, userId, previousOrder, nextOrder) {
        this.imageId = imageId;
        this.userId = userId;
        this.previousOrder = previousOrder;
        this.nextOrder = nextOrder;
    }
}
exports.ReorderImageDTO = ReorderImageDTO;
class BulkUploadDTO {
    constructor(userId, files, titles, originalFileNames, mimeTypes, fileSizes) {
        this.userId = userId;
        this.files = files;
        this.titles = titles;
        this.originalFileNames = originalFileNames;
        this.mimeTypes = mimeTypes;
        this.fileSizes = fileSizes;
    }
}
exports.BulkUploadDTO = BulkUploadDTO;
