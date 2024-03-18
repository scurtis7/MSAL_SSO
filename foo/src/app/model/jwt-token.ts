export interface JwtToken {
  aud: string;
  exp: number;
  iat: number;
  nbf: number;
  iss: string;
  name: string;
  nonce: string;
  oid: string;
  preferred_username: string;
  rh: string
  sub: string;
  tid: string;
  uti: string;
  ver: string;
}
