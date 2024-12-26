import { Router } from "express";

import { isAuthenticated, isOwner } from "$middlewares/permissions";
import { getAllUsers, deleteUser, updateUser } from "$controllers/user.ctrl";

export default async (routers: Router) => {
  routers.get("/users", isAuthenticated, getAllUsers);
  routers.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  routers.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
