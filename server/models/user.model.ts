import "dotenv/config";
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export interface IUserCourseRef {
  _id?: mongoose.Types.ObjectId | string;
  courseId?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: IUserCourseRef[];
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator(value: string) {
          return emailRegexPattern.test(value);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },

    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    avatar: {
      public_id: String,
      url: String,
    },

    role: {
      type: String,
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    courses: [{ courseId: String }],
  },

  { timestamps: true }
);

userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.SignAccessToken = function (this: IUser) {
  return jwt.sign({ id: this._id.toString() }, process.env.ACCESS_TOKEN ?? "", {
    expiresIn: "5m",
  });
};

userSchema.methods.SignRefreshToken = function (this: IUser) {
  return jwt.sign({ id: this._id.toString() }, process.env.REFRESH_TOKEN ?? "", {
    expiresIn: "3d",
  });
};

userSchema.methods.comparePassword = function (
  this: IUser,
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
