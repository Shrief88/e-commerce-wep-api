import mongoose, { Schema } from "mongoose";
import bycrpt from "bcryptjs";

import returnImageUrl from "../utils/returnImageUrl";

enum Roles {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
}

export interface IUser extends mongoose.Document {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  password: string;
  profileImage?: string;
  address?: string;
  role: Roles;
  passwordChangedAt?: Date;
  passwordResetCode?: string;
  passwordResetExpires?: Date;
  passwordResetVerified?: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 32,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // TODO: find way to make phone unique and not required in the same time
    phone: {
      type: String,
      // unique: true,
      trim: true,
      // required: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetCode: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    passwordResetVerified: {
      type: Boolean,
    },
    profileImage: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      required: true,
      type: String,
      enum: Object.values(Roles),
      default: Roles.USER,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.post<IUser>("init", function (doc) {
  returnImageUrl<IUser>(doc, "user");
});

userSchema.post<IUser>("save", function (doc) {
  returnImageUrl<IUser>(doc, "user");
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycrpt.hash(this.password, 12);
});

export default mongoose.model<IUser>("User", userSchema);
