import mongoose, { Schema } from "mongoose";
import env from "../validators/validateEnv";

enum roles {
  admin,
  user,
}

export interface IUser extends mongoose.Document {
  name: string;
  slug: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  address: string;
  role: roles;
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
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
    },
    address: {
      type: String,
      required: true,
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

export default mongoose.model<IUser>("User", userSchema);
