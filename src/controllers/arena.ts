import moment from "moment";
import mongose from "mongoose";
import { ApolloError } from "apollo-server-express";

import arenaModel from "../models/arena";
import { newArena, findInput, arenaEditInfo } from "../schema/ArenaSchema";
import Jwt from "../utils/jwt";
import JwtAdmin from "../utils/jwtAdmin";
import JwtArena from "../utils/jwtArena";

export const addArena = async (
  { name, portrait, description, minPoints }: newArena,
  ctx: any
) => {
  try {
    let token = ctx.req.headers.token;
    console.log(ctx.req.ipInfo);

    let localToken = await JwtAdmin.validateToken(token);

    let tokenData: any = await JwtAdmin.decrypt_data(localToken)();

    if (ctx.req.ipInfo.error) {
      ctx.req.ipInfo = {};
    }

    let newArena = new arenaModel({
      name,
      portrait,
      description,
      minPoints,
      created_by: tokenData.userId,
      updated_by: tokenData.userId,
      created_at: moment().format("YYYY-MM-DD/HH:mm:ZZ"),
      updated_at: moment().format("YYYY-MM-DD/HH:mm:ZZ")
    });
    await newArena.save();
    return Promise.resolve(`${newArena._id} succesfully created`);
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const deleteArena = async ({ id }: any, ctx: any) => {
  try {
    let token = ctx.req.headers.token;

    let localToken = await JwtAdmin.validateToken(token);

    let tokenData: any = await JwtAdmin.decrypt_data(localToken)();

    let deletedArena = await arenaModel.delete({ _id: id }, tokenData.userId);

    return Promise.resolve(`${id.toString()} succesfully deleted`);
  } catch (error) {
    console.log(error);

    throw new ApolloError(error);
  }
};

export const getArenas = async ({ page = 0, size = 0, search }: findInput) => {
  try {
    let offset = page * size;
    let limit = offset + size;

    let result =
      search.length > 0
        ? await arenaModel
            .find({
              $or: [
                { name: { $regex: ".*" + search + ".*" } },
                { _id: { $regex: ".*" + search + ".*" } }
              ]
            })
            .skip(offset)
            .limit(limit)
        : await arenaModel
            .find({})
            .skip(offset)
            .limit(limit);

    return Promise.resolve(result);
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const modifyArena = async (
  { name, portrait, description, minPoints, id }: arenaEditInfo,
  ctx: any
) => {
  try {
    let token = ctx.req.headers.token;

    let localToken = await JwtAdmin.validateToken(token);

    let tokenData: any = await JwtAdmin.decrypt_data(localToken)();

    if (ctx.req.ipInfo.error) {
      ctx.req.ipInfo = {};
    }

    let newArena = await arenaModel.findByIdAndUpdate(
      id,
      {
        name,
        portrait,
        description,
        minPoints,
        created_by: tokenData.userId,
        updated_by: tokenData.userId,
        updated_at: moment().format("YYYY-MM-DD/HH:mm:ZZ")
      },
      { omitUndefined: true }
    );

    return Promise.resolve(`${newArena._id} succesfully updated`);
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const getPoints = async (ctx: any) => {
  try {
    let token = ctx.req.headers.token;

    let localToken = await Jwt.validateToken(
      token,
      ctx.req.body.variables.publicKey
    );
    let tokenData: any = await Jwt.decrypt_data(localToken)();
    let result = await arenaModel.find({}).lean();

    let newResult = result.map(i => ({ id: i._id, minPoints: i.minPoints }));

    let tokenArena = new JwtArena({
      userId: tokenData.userId,
      arenas: JSON.stringify(newResult)
    });

    await tokenArena.create_token("1d");

    return Promise.resolve({
      msg: tokenArena.token,
      code: "200"
    });
  } catch (error) {
    console.log(error);

    throw new ApolloError(error);
  }
};
