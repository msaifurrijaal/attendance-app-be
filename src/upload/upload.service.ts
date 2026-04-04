import { Injectable, BadRequestException } from '@nestjs/common';
import { errorHandler } from 'src/utils/errorHandler.util';
import { mappingResponse } from 'src/utils/responseHandler.util';

@Injectable()
export class UploadService {
  uploadImage(file: Express.Multer.File) {
    try {
      if (!file) throw new BadRequestException('File is required');

      return mappingResponse({
        message: 'Image uploaded successfully',
        extras: {
          url: `/uploads/images/${file.filename}`,
        },
      });
    } catch (error) {
      errorHandler(error);
    }
  }
}
