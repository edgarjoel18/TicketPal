import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "someString";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// A function to run before each of our tests. Make sure to reset the data in the database
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // build a JWT payload. An object that has an id and email
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@mail.com",
  };
  // create the jwt. The sign() creates the jsonwebtoken
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build the session object
  const session = { jwt: token };

  // Turn that session into json
  const sessionJSON = JSON.stringify(session);

  // take json and encode it as base64
  const base65 = Buffer.from(sessionJSON).toString("base64");

  // return the string thats the cookie
  return [`express:sess=${base64}`];
};
