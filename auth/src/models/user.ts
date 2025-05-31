import mongoose from "mongoose";
import { Password } from "../services/password";

// An Interface that describes the properties
// that are required to create a new User

interface UserAttrs {
  email: string;
  password: string;
}

// An Interface that describes the properties
// that a User Model has.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An Interface that describes the properties
// that a User Document has.
interface UserDoc extends mongoose.Document {
  // What does the line extends mongoose.Document mean ?
  // We are going to say what is the definition of a user document is, Take all the properties that a normal
  // document has and we are going to add a couple of more on top.
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
        // doc is the actual user document which is eventually get converted into JSON. We are not going to return
        // anything here but we are making direct changes to the ret object which is the JSON representation of the document.
        // This is a function that will be called when we convert the document to JSON.
        // We are going to remove the password and __v properties from the response.
        ret.id = ret._id; // We are going to add an id property to the response which is the same as _id property.
        delete ret._id; // We are going to delete the _id property from the response.
        delete ret.password; // We are going to delete the password property from the response.
        delete ret.__v; // We are going to delete the __v property from the response.
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  // This is a middleware function that runs before saving the document to the database.;

  if (this.isModified("password")) {
    // this === the user document that is being saved
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done(); // This is a callback function that we need to call when we are done with the middleware function.
  // If we don't call this function then the save() function will not be called.
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}; // This is how we will get a custom function built into a model. We add it to the statics property on our schema.

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// The angular bracket <> syntax that we see above is a generic syntax inside a typescript.
// We can really think of these generic things as essentially being functions (or) types.
// In the above we are calling the mongoose.model() function with a set of parantheses.
// When we normally call a function inside a typescript (or) javascript, We will pass a set of
// arguments. These arguments can be customized like how a function behaves. The same thing is true
// for this list of generic type arguments as well. <UserDoc, UserModel> ==> we can really think of these
// as being some arguments to the function of a model but instead of a data type (or) an  actual value like
// let us say a string of user (or) UserSchema then it is instead a type. Types being provided to a function as
// arguments.

// Testing purposes
// const user = User.build({
//   email: "test@test.com",
//   password: "123as344@345",
// });

// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

export { User };
