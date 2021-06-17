import mongoose from "mongoose";
import { Password } from "../services/password";

// Interface for describing the properties needed to create a new user
interface UserAttributes {
  email: string;
  password: string;
}

// interface that describes properties that a user model has. Tells typescript that we are going to add a function to User
interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc;
}

// An interface that describes the properties that a User Document has.(Properties that a single user has)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  // Hash the password if it has been modified
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// call this function instead of directly calling the constructor for User. Typescript now knows the right amount of properties needed
// const buildUser = (attributes: UserAttributes) => {
//   return new User(attributes);
// }; // We just added this as a static

export { User };
