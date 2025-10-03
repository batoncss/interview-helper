export type JwtPayload = {
  username: string;
  user_id: number;
  exp: number;
  iat: number;
  token_type: string;
  jti: string;
};
