export type MediaModel = {
  id: number;
  name: string;
  type: TypeModel;
  size: number;
  path: string | null;
  domain: string;
  url: string;
  application: string;
  dateUploaded: Date;
  dateUpdated: Date;
  isDeleted: boolean;
};

export type MediaRequestModel = {
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  path: string | null;
  domain: string;
};

export type MediaUpdateRequestModel = {
  name: string | null;
  size: number | null;
  path: string | null;
  clearPath: boolean | false;
};

export type TypeModel = {
  extension: string;
  mimeType: string;
};