import { RouteParams, Request, Response } from "https://deno.land/x/oak/mod.ts";
import User from "../models/user.ts";

// ------------- //
// CRUD handlers //
// ------------- //

// create user
export async function userCreate(
  ctx: { request: Request; response: Response },
) {
  const data = await ctx.request.body();
  if (
    data == undefined || data.value.email == undefined ||
    data.value.password == undefined
  ) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid data" };
    return;
  }

  const result = User.create(data.value.email, data.value.password);
  ctx.response.status = result.status;
  if (result.error) {
    ctx.response.body = { error: result.data };
    return;
  }
  ctx.response.body = { ukey: result.data.ukey, email: result.data.email };
}

// read user
export function userProfile(
  ctx: { params: RouteParams; request: Request; response: Response },
) {
  if (ctx.params == undefined || ctx.params.ukey == undefined) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid data" };
    return;
  }

  // check if user exists
  const user = User.getByUkey(ctx.params.ukey);
  if (user == undefined) {
    ctx.response.status = 404;
    ctx.response.body = { error: "User not found" };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = { ukey: ctx.params.ukey, email: user.email };
}

// update user
export async function userUpdate(
  ctx: { params: RouteParams; request: Request; response: Response },
) {
  if (ctx.params == undefined || ctx.params.ukey == undefined) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid data" };
    return;
  }

  // check body
  const data = await ctx.request.body();
  if (data == undefined || data.value.email == undefined) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid data" };
    return;
  }

  // check if user exists
  const user = User.getByUkey(ctx.params.ukey);
  if (user == undefined) {
    ctx.response.status = 404;
    ctx.response.body = { error: "User not found" };
    return;
  }

  // update user
  user.email = data.value.email;
  if (user.save()) {
    ctx.response.status = 200;
    ctx.response.body = { ukey: ctx.params.ukey, email: user.email };
    return;
  }

  ctx.response.status = 500;
  ctx.response.body = { error: "Server error" };
}

// delete user
export function userDelete(
  ctx: { params: RouteParams; request: Request; response: Response },
) {
  if (ctx.params == undefined || ctx.params.ukey == undefined) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid data" };
    return;
  }

  // check if user exists
  const user = User.getByUkey(ctx.params.ukey);
  if (user == undefined) {
    ctx.response.status = 404;
    ctx.response.body = { error: "User not found" };
    return;
  }

  // delete user
  user.delete();
  ctx.response.status = 200;
  ctx.response.body = {};
}
