import { Request, Response } from "express";

import { COOKIE } from "$configs/constants";
import { createUser, getUserByEmail } from "$queries/users";
import { authentication, random } from "$helpers/utils";

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) return res.sendStatus(400);
    if (await getUserByEmail(email)) return res.sendStatus(400);

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error("ERROR:", error);
    return res.sendStatus(400);
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.sendStatus(400);

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) res.sendStatus(400);

    const expectedHas = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHas) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res.cookie(COOKIE, user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error("ERROR:", error);
    return res.sendStatus(400);
  }
};
