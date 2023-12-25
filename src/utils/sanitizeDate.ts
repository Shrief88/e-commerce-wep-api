import { type IUser } from "../models/user";

export interface SanitizeUser {
  _id: IUser["_id"];
  name: IUser["name"];
  slug: IUser["slug"];
  email: IUser["email"];
  addresses: IUser["addresses"];
  wishList?: IUser["wishlist"];
}

export const sanitizeUser = (user: IUser): SanitizeUser => {
  return {
    _id: user._id,
    name: user.name,
    slug: user.slug,
    email: user.email,
    addresses: user.addresses,
    wishList: user.wishlist,
  };
};
