import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const imageMulterConfig = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const ext = extname(file.originalname);
      cb(null, `${timestamp}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      cb(new BadRequestException('Only image files are allowed'), false);
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
};
