import mongoose from "mongoose";

// An Interface that describes the properties
// that are required to create a new User

interface UserAttrs {
  email: string;
  password: string;
}

// An Interface that describes the properties
// that a User Model has.
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}; // This is how we will get a custom function built into a model. We add it to the statics property on our schema.

const User = mongoose.model<any, UserModel>("User", userSchema);

// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

export { User };
