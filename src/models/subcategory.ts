import mongoose, { Schema } from "mongoose";

interface ISubcategory {
  name: string;
  slug: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 32,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ISubcategory>("Subcategory", subcategorySchema);
