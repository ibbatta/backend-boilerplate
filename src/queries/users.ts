import { UserDbModel } from "$models/users.mdl";

export const getUsers = () => UserDbModel.find();
export const getUserByEmail = (email: string) => UserDbModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserDbModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
export const getUserById = (id: string) => UserDbModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserDbModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserDbModel.findByIdAndDelete(id);
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserDbModel.findByIdAndUpdate(id, values);
