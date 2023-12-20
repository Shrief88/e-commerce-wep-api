import mongoose, { Schema } from "mongoose";

export interface ISubcategory extends mongoose.Document {
  name: string;
  slug: string;
  category: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subcategorySchema = new Schema<ISubcategory>(
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

// Return Category name in the response
subcategorySchema.pre<ISubcategory>(/^find/, function (next) {
  void this.populate({
    path: "category",
    select: "name",
  });
  next();
});

export const SubcategoryModel = mongoose.model<ISubcategory>(
  "Subcategory",
  subcategorySchema,
);
