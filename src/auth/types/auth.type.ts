export interface UserJwtPayload extends Record<string, unknown> {
  id: string;
  email: string;
  role: string;
}
