import { Document, ObjectId } from "mongodb";

export interface IGridFSObject {
  _id: ObjectId;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  md5?: string;
  filename: string;
  contentType?: string | undefined;
  metadata?: Document | undefined;
}
