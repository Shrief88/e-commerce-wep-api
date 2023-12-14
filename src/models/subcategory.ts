import mongoose, { Schema } from "mongoose";

export interface ISubcategory extends mongoose.Document {
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

subcategorySchema.pre<ISubcategory>(/^find/, function (next) {
  void this.populate({
    path: "category",
    select: "name",
  });
  next();
});

export default mongoose.model<ISubcategory>("Subcategory", subcategorySchema);
