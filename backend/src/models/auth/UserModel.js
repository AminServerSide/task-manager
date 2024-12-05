import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },

    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password!"],
    },

    photo: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/19819005?v=4",
    },

    bio: {
      type: String,
      default: "I am a new user.",
    },

    role: {
      type: String,
      enum: ["admin", "supervisor", "employee"],
      default: "employee", // default is employee unless specified during registration
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: true }
);

// hash the password before saving
UserSchema.pre("save", async function (next) {
  // check if the password is not modified
  if (!this.isModified("password")) {
    return next();
  }

  // hash the password ==> bcrypt
  // generate salt
  const salt = await bcrypt.genSalt(10);
  // hash the password with the salt
  const hashedPassword = await bcrypt.hash(this.password, salt);
  // set the password to the hashed password
  this.password = hashedPassword;

  // call the next middleware
  next();
});

// Function to set role based on registration code (added)
UserSchema.methods.setRoleBasedOnCode = function (code) {
  switch (code) {
    case "1111":
      this.role = "employee";
      break;
    case "2222":
      this.role = "supervisor";
      break;
    case "3333":
      this.role = "admin";
      break;
    default:
      this.role = "employee"; // default role is employee
  }
};

const User = mongoose.model("User", UserSchema);

export default User;
