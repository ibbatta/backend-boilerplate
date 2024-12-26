import { MongoUrlType } from "$configs/type";

export const GET_MONGO_URL = ({
  username,
  password,
  cluster,
}: MongoUrlType): string => {
  const userEncoded = encodeURIComponent(username);
  const passEncoded = encodeURIComponent(password);
  return `mongodb+srv://${userEncoded}:${passEncoded}@${cluster}.mongodb.net/retryWrites=true&w=majority`;
};
