export type FilterModel = {
  id: number;
  name: string;
  values: string[];
  isDeleted: boolean;
}

export type FilterRequestModel = {
  name: string;
  values: string[];
}