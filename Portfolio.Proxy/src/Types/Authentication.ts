export type AuthenticationModel = {
  type: string;
  token: string;
  expiresIn: number;
  info: AuthenticationInfoModel;
}

export type AuthenticationInfoModel = {
  applicationName: string;
  scopes: string[];
  issued: Date;
  expires: Date;
}

export interface AuthoriseModel {
  phrase: string;
}

export interface LoginModel {
  username: string;
  password: string;
}

export interface AuthStatusModel {
  authenticated: boolean;
}