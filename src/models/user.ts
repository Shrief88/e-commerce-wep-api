import mongoose, { Schema } from "mongoose";
import env from "../config/validateEnv";
import bycrpt from "bcryptjs";

enum roles {
  admin,
  user,
  manager,
}

export interface IUser extends mongoose.Document {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  password: string;
  profileImage?: string;
  address?: string;
  role: roles;
  passwordChangedAt?: Date;
  passwordResetCode?: string;
  passwordResetExpires?: Date;
  passwordResetVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
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
      type: String,
      enum: roles,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.post("init", function (doc) {
  if (doc.profileImage) {
    const imageUrl = `${env.BASE_URL}/user/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
});

userSchema.post("save", function (doc) {
  if (doc.profileImage) {
    const imageUrl = `${env.BASE_URL}/user/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycrpt.hash(this.password, 12);
});

export default mongoose.model<IUser>("User", userSchema);