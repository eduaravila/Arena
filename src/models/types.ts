import mongoose, { Model } from "mongoose";
import {
  SoftDeleteDocument,
  SoftDeleteInterface,
  SoftDeleteModel
} from "mongoose-delete";

export interface ArenaModelType extends mongoose.Document, SoftDeleteDocument {
  name: string;
  portrait: string;
  description: string;
  minPoints: number;
  created_at: string;
  updated_at: string;
  created_by: mongoose.Types.ObjectId;
  updated_by: mongoose.Types.ObjectId;
}

export interface ArenaModelStaticsType
  extends SoftDeleteModel<ArenaModelType> {}
