import {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Order,
} from 'sequelize';

export interface UserModel
    extends Model<
        InferAttributes<UserModel>,
        InferCreationAttributes<UserModel>
    > {
    id: CreationOptional<number>;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    imageUrl: string | null;
    role: string;
}

export interface AddressModel
    extends Model<
        InferAttributes<AddressModel>,
        InferCreationAttributes<AddressModel>
    > {
    id: CreationOptional<number>;
    name: string;
    recipientName: string;
    phoneNumber: string;
    country: string;
    city: string;
    zipcode: string | null;
    street: string;
    houseNumber: number;
}

export interface OrderModel
    extends Model<
        InferAttributes<OrderModel>,
        InferCreationAttributes<OrderModel>
    > {
    id: CreationOptional<number>;
    status: string;
    price: number;
}

export interface CartModel
    extends Model<
        InferAttributes<CartModel>,
        InferCreationAttributes<CartModel>
    > {
    id: CreationOptional<number>;
}

export interface CartProductModel
    extends Model<
        InferAttributes<CartProductModel>,
        InferCreationAttributes<CartProductModel>
    > {
    id: CreationOptional<number>;
    productId: number;
}
export interface WishlistModel
    extends Model<
        InferAttributes<WishlistModel>,
        InferCreationAttributes<WishlistModel>
    > {
    id: CreationOptional<number>;
}
export interface WishlistProductModel
    extends Model<
        InferAttributes<WishlistProductModel>,
        InferCreationAttributes<WishlistProductModel>
    > {
    id: CreationOptional<number>;
    productId: number;
}
export interface ProductModel
    extends Model<
        InferAttributes<ProductModel>,
        InferCreationAttributes<ProductModel>
    > {
    id: CreationOptional<number>;
    name: string;
    imageUrl: string | null;
    averageRate: number;
    price: number;
    discountPrice: number | null;
}
export interface DiscountModel
    extends Model<
        InferAttributes<DiscountModel>,
        InferCreationAttributes<DiscountModel>
    > {
    id: CreationOptional<number>;
    percent: number;
    expiresIn: number;
}
export interface TypeModel
    extends Model<
        InferAttributes<TypeModel>,
        InferCreationAttributes<TypeModel>
    > {
    id: CreationOptional<number>;
    name: string;
}
export interface RatingModel
    extends Model<
        InferAttributes<RatingModel>,
        InferCreationAttributes<RatingModel>
    > {
    id: CreationOptional<number>;
    rate: number;
    text: string;
}
export interface LikeModel
    extends Model<
        InferAttributes<LikeModel>,
        InferCreationAttributes<LikeModel>
    > {
    id: CreationOptional<number>;
}
