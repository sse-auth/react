export interface UserProps {
  [key: string]: any;
}

export interface ResponseProps {
  error: Error | null | unknown;
  accessToken: string | null | object;
  userData: UserProps | null;
}
