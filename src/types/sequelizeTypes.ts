import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
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
    cart?: CartModel;
    wishlist?: WishlistModel;
    reviews?: ReviewModel[];
    likes?: LikeModel[];
    addresses?: AddressModel[];
    orders?: OrderModel[];
}

export interface AddressModel
    extends Model<
        InferAttributes<AddressModel>,
        InferCreationAttributes<AddressModel>
    > {
    id: CreationOptional<number>;
    name: string;
    country: string;
    city: string;
    zipcode?: string;
    state?: string;
    streetAddress: string;
    userId: ForeignKey<UserModel['id']>;
    orders?: OrderModel[];
}

export interface OrderModel
    extends Model<
        InferAttributes<OrderModel>,
        InferCreationAttributes<OrderModel>
    > {
    id: CreationOptional<number>;
    status: string;
    price: number;
    paymentMethod: string;
    addressId: ForeignKey<AddressModel['id']>;
    userId: ForeignKey<UserModel['id']>;
    order_products?: OrderProductModel[];
}
export interface OrderProductModel
    extends Model<
        InferAttributes<OrderProductModel>,
        InferCreationAttributes<OrderProductModel>
    > {
    id: CreationOptional<number>;
    orderId: ForeignKey<OrderModel['id']>;
    productId: ForeignKey<ProductModel['id']>;
}

export interface OrderRecipientModel
    extends Model<
        InferAttributes<OrderRecipientModel>,
        InferCreationAttributes<OrderRecipientModel>
    > {
    id: CreationOptional<number>;
    orderId: ForeignKey<OrderModel['id']>;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

export interface CartModel
    extends Model<
        InferAttributes<CartModel>,
        InferCreationAttributes<CartModel>
    > {
    id: CreationOptional<number>;
    userId: ForeignKey<UserModel['id']>;
    cart_products?: CartProductModel[];
}

export interface CartProductModel
    extends Model<
        InferAttributes<CartProductModel>,
        InferCreationAttributes<CartProductModel>
    > {
    id: CreationOptional<number>;
    productId: number;
    cartId: ForeignKey<CartModel['id']>;
}
export interface WishlistModel
    extends Model<
        InferAttributes<WishlistModel>,
        InferCreationAttributes<WishlistModel>
    > {
    id: CreationOptional<number>;
    userId: ForeignKey<UserModel['id']>;
    wishlist_products?: WishlistProductModel[];
}
export interface WishlistProductModel
    extends Model<
        InferAttributes<WishlistProductModel>,
        InferCreationAttributes<WishlistProductModel>
    > {
    id: CreationOptional<number>;
    productId: number;
    wishlistId: ForeignKey<WishlistModel['id']>;
}
export interface ProductModel
    extends Model<
        InferAttributes<ProductModel>,
        InferCreationAttributes<ProductModel>
    > {
    id: CreationOptional<number>;
    name: string;
    images: string[] | null;
    price: number;
    discountPrice: number | null;
    typeId: ForeignKey<TypeModel['id']>;
    productGroupId?: ForeignKey<ProductGroupModel['id']>;
    discount?: DiscountModel;
    reviews?: ReviewModel[];
    cart_products?: CartProductModel[];
    wishlist_products?: WishlistProductModel[];
    order_products?: OrderProductModel[];
}
export interface ProductInfoModel
    extends Model<
        InferAttributes<ProductInfoModel>,
        InferCreationAttributes<ProductInfoModel>
    > {
    id: CreationOptional<number>;
    name: string;
    text: string;
    productId?: ForeignKey<ProductModel['id']>;
}
export interface ProductGroupModel
    extends Model<
        InferAttributes<ProductGroupModel>,
        InferCreationAttributes<ProductGroupModel>
    > {
    id: CreationOptional<number>;
    averageRate: number;
    products?: ProductModel[];
    reviews?: ReviewModel[];
}
export interface DiscountModel
    extends Model<
        InferAttributes<DiscountModel>,
        InferCreationAttributes<DiscountModel>
    > {
    id: CreationOptional<number>;
    percent: number;
    startsIn: number;
    expiresIn: number;
    productId: ForeignKey<ProductModel['id']>;
}
export interface TypeModel
    extends Model<
        InferAttributes<TypeModel>,
        InferCreationAttributes<TypeModel>
    > {
    id: CreationOptional<number>;
    name: string;
}
export interface ReviewModel
    extends Model<
        InferAttributes<ReviewModel>,
        InferCreationAttributes<ReviewModel>
    > {
    id: CreationOptional<number>;
    rate: number;
    text: string;
    userId: ForeignKey<UserModel['id']>;
    productGroupId: ForeignKey<ProductGroupModel['id']>;
}
export interface LikeModel
    extends Model<
        InferAttributes<LikeModel>,
        InferCreationAttributes<LikeModel>
    > {
    id: CreationOptional<number>;
    userId: ForeignKey<UserModel['id']>;
    reviewId: ForeignKey<ReviewModel['id']>;
}
