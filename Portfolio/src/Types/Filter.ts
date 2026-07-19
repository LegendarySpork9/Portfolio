export type FilterType = "tag" | "numeric" | "text" | "boolean" | "null" | "comparison";

export type FilterModel = {
  id: number;
  name: string;
  type: FilterType;
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