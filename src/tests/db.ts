import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
const mongod = MongoMemoryServer.create();
export const connect = async (): Promise<void> => {
  const uri = (await mongod).getUri();
  await mongoose.connect(uri);
};
export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await (await mongod).stop();
};

export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
