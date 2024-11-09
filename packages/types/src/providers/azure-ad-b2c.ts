export interface AzureADB2CProfile {
  exp: number;
  nbf: number;
  ver: string;
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  auth_time: number;
  oid: string;
  country: string;
  name: string;
  postalCode: string;
  emails: string[];
  tfp: string;
  preferred_username: string;
}
