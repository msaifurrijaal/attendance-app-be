export const toPhotoUrl = (path: string | null): string | null => {
  if (!path) return null;
  return `${process.env.APP_URL}${path}`;
};

export const mapPhotoUrls = <T extends Record<string, any>>(
  data: T,
  fields: (keyof T)[],
): T => {
  const result = { ...data };
  fields.forEach((field) => {
    result[field] = toPhotoUrl(data[field]) as T[keyof T];
  });
  return result;
};
