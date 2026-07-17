export type UserModel = {
  id: number;
  username: string;
  password: string;
  scopes: string[];
  isDeleted: boolean;
};