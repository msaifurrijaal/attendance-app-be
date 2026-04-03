import { IResponse } from 'src/types/util.type';

export const mappingResponse = (response: IResponse) => {
  const { message, extras } = response;
  return { message, ...extras };
};
