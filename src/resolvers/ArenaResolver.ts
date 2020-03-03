import {
  Resolver,
  Query,
  FieldResolver,
  Root,
  Mutation,
  Arg,
  Ctx,
  ID
} from "type-graphql";
import {
  Arena,
  SuccessResponse,
  newArena,
  findInput,
  arenaEditInfo
} from "../schema/ArenaSchema";
import arenaModel from "../models/arena";
import {
  addArena,
  deleteArena,
  getArenas,
  modifyArena
} from "../controllers/arena";
import mongoose from "mongoose";

@Resolver(of => Arena)
export class ArenaResolver {
  @Query(returns => [Arena])
  async Arenas(@Arg("findInput", () => findInput) findInput: findInput) {
    let msg = await getArenas(findInput);
    return [...msg];
  }

  @Mutation(returns => SuccessResponse, {
    description: "Admin query 🔏"
  })
  async NewArena(
    @Arg("newArena", () => newArena) newArena: newArena,
    @Ctx() ctx: any
  ) {
    let msg = await addArena(newArena, ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Mutation(returns => SuccessResponse, {
    description: "Admin query 🔏"
  })
  async DeleteArena(
    @Arg("id", () => ID) id: mongoose.Types.ObjectId,
    @Ctx() ctx: any
  ) {
    let msg = await deleteArena({ id }, ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Mutation(returns => SuccessResponse, {
    description: "Admin query 🔏"
  })
  async ModifyArena(
    @Arg("arenaEditInfo", () => arenaEditInfo) arenaEditInfo: arenaEditInfo,
    @Ctx() ctx: any
  ) {
    let msg = await modifyArena(arenaEditInfo, ctx);
    return {
      msg,
      code: "200"
    };
  }
}
