import { Request, Response, NextFunction } from "express";

import { COOKIE } from "$configs/constants";
import { getUserBySessionToken } from "$queries/users";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const sessionToken = req.cookies[COOKIE];
    if (!sessionToken) return res.sendStatus(403);

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) return res.sendStatus(403);

    Object.assign(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.error("ERROR", error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: Request & { identity?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const currentUserId = req?.identity?._id;

    if (!currentUserId) return res.sendStatus(400);

    if (currentUserId.toString() !== id) return res.sendStatus(403);

    next();
  } catch (error) {
    console.error("ERROR", error);
    return res.sendStatus(400);
  }
};
