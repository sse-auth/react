export interface UserProps {
  [key: string]: any;
}

export interface ResponseObjProps {
  error: Error | null | unknown;
  accessToken: string | null | object;
  userData: UserProps | null;
}

export type ResponseProps<T> = {
  error: Error | null | unknown;
  accessToken: string | null;
  userData: T | null;
};

export type LoginButtonProps<T> = T & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
};

export type IconButtonProps<T> = T & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
  //   icon: IconProps["icon"];
  icon?: React.ReactNode | string;
  variant?: string;
  className?: string;
};
