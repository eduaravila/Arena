import mongoose, { Schema, mongo } from "mongoose";
import bc from "bcrypt";
import moment from "moment";
import { ArenaModelType, ArenaModelStaticsType } from "./types";
import mongoose_delete from "mongoose-delete";

const Arena_Schama: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  portrait: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  minPoints: {
    type: Number,
    required: true
  },
  created_at: {
    type: String,
    required: true,
    default: moment().format("YYYY-MM-DD/HH:mm:ZZ")
  },
  updated_at: {
    type: String,
    required: true,
    default: moment().format("YYYY-MM-DD/HH:mm:ZZ")
  },
  created_by: {
    type: mongoose.Types.ObjectId
  },
  updated_by: {
    type: mongoose.Types.ObjectId
  }
});

Arena_Schama.plugin(mongoose_delete, {
  deletedAt: true,
  indexFields: true,
  overrideMethods: true,
  deletedBy: true
});

const arena_model = mongoose.model<ArenaModelType, ArenaModelStaticsType>(
  "arena",
  Arena_Schama
);

export default arena_model;
