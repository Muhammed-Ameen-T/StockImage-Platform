export interface IJwtDecoded {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
