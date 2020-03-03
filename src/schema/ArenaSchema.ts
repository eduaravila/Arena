import { ObjectType, Field, Int, ID, InputType, Directive } from "type-graphql";
import {
  Trim,
  SanitizerConstraint,
  SanitizerInterface,
  Sanitize
} from "class-sanitizer";

import arenaModel from "../models/arena";
import mongoose from "mongoose";

@SanitizerConstraint()
export class toLowerCase implements SanitizerInterface {
  sanitize(text: string): string {
    return text.toLowerCase();
  }
}

@ObjectType()
export class SuccessResponse {
  @Field(type => String)
  msg?: string;

  @Field(type => String)
  code?: string;
}

@InputType()
export class findInput {
  @Field(type => Int, { nullable: true })
  page: number;

  @Field(type => Int, { nullable: true })
  size: number;

  @Field(type => String, { nullable: true, defaultValue: "" })
  @Trim()
  @Sanitize(toLowerCase)
  search: string;
}

@Directive(`@key(fields:"_id")`)
@ObjectType()
export class Arena {
  @Field(type => ID, { nullable: false })
  _id: mongoose.Types.ObjectId;

  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => String, { nullable: true })
  portrait: string;

  @Field(type => String, { nullable: true })
  description: string;

  @Field(type => Int, { nullable: true })
  minPoints: number;

  @Field(type => String, { nullable: true })
  created_at: string;

  @Field(type => String, { nullable: true })
  updated_at: string;

  @Field(type => ID, { nullable: true })
  updated_by: mongoose.Types.ObjectId;

  @Field(type => ID, { nullable: true })
  created_by: mongoose.Types.ObjectId;
}

@InputType()
export class newArena {
  @Field(type => String)
  name: string;

  @Field(type => String)
  portrait: string;

  @Field(type => String)
  description: string;

  @Field(type => Int)
  minPoints: number;
}

@InputType()
class editArena {
  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => String, { nullable: true })
  portrait: string;

  @Field(type => String, { nullable: true })
  description: string;

  @Field(type => Int, { nullable: true })
  minPoints: number;
}

@InputType()
export class arenaEditInfo extends editArena {
  @Field(type => ID)
  id: mongoose.Types.ObjectId;
}

export async function resolveArenaReference(
  reference: Pick<Arena, "_id">
): Promise<Arena> {
  let result = await arenaModel.findOne({ _id: reference._id });

  return result;
}
