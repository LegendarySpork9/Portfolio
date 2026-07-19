export type FilterModel = {
  id: number;
  name: string;
  type: string;
  operator: string | null;
  path: string | null;
  values: string[];
  isDeleted: boolean;
};

export type FilterRequestModel = {
  name: string;
  type: string;
  operator: string | null;
  path: string | null;
  values: string;
};