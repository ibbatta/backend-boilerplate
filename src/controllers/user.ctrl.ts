import { Request, Response } from "express";

import {
  getUsers,
  deleteUserById,
  updateUserById,
  getUserById,
} from "$queries/users";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = await getUsers();
    res.status(200).json(user);
  } catch (error) {
    console.error("ERROR", error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error) {
    console.error("ERROR", error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) return res.sendStatus(400);

    const user = await getUserById(id);
    user.username = username;

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.error("ERROR", error);
    return res.sendStatus(400);
  }
};
