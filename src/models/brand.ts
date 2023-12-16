import mongoose, { Schema } from "mongoose";
import env from "../validators/validateEnv";

export interface IBrand extends mongoose.Document {
  name: string;
  slug: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 2,
      maxLength: 32,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

brandSchema.post("init", function (doc) {
  const imageUrl = `${env.BASE_URL}/category/${doc.image}`;
  doc.image = imageUrl;
});

brandSchema.post("save", function (doc) {
  const imageUrl = `${env.BASE_URL}/category/${doc.image}`;
  doc.image = imageUrl;
});

export default mongoose.model<IBrand>("Brand", brandSchema);
