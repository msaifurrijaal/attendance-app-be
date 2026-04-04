import { ConflictException } from '@nestjs/common';

export const errorHandler = (error: any) => {
  const err = error?.driverError ?? error;

  if (err?.code === 'ER_DUP_ENTRY') {
    const sqlMessage = err.sqlMessage as string;
    const partsMessages = sqlMessage.split(' ');
    const duplicateValue =
      partsMessages.find((part) => part.includes("'")) ?? '';

    throw new ConflictException(`Value '${duplicateValue}' already exists`);
  }

  throw error;
};
