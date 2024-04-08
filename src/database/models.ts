import sequelize from '../db';
import { DataTypes } from 'sequelize';
import {
    AddressModel,
    CartModel,
    CartProductModel,
    DiscountModel,
    LikeModel,
    OrderModel,
    OrderProductModel,
    ProductColorsGroupModel,
    ProductInfoModel,
    ProductModel,
    ReviewModel,
    TypeModel,
    UserModel,
    WishlistModel,
    WishlistProductModel,
} from '../types/sequelizeTypes';
import { text } from 'express';

export const User = sequelize.define<UserModel>('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, unique: false, allowNull: false },
    lastName: { type: DataTypes.STRING, unique: false, allowNull: false },
    displayName: { type: DataTypes.STRING, unique: false, allowNull: false },
    imageUrl: { type: DataTypes.STRING, unique: false, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'USER' },
});

export const Address = sequelize.define<AddressModel>('address', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    recipientName: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.INTEGER, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    zipcode: { type: DataTypes.INTEGER, allowNull: true },
    street: { type: DataTypes.STRING, allowNull: false },
    houseNumber: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
});

export const Order = sequelize.define<OrderModel>('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    addressId: { type: DataTypes.INTEGER, allowNull: false },
});
export const OrderProduct = sequelize.define<OrderProductModel>(
    'order_product',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        productId: { type: DataTypes.INTEGER, allowNull: false },
        orderId: { type: DataTypes.INTEGER, allowNull: false },
    },
);

export const Cart = sequelize.define<CartModel>('cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
});
export const CartProduct = sequelize.define<CartProductModel>('cart_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    cartId: { type: DataTypes.INTEGER, allowNull: false },
});

export const Wishlist = sequelize.define<WishlistModel>('wishlist', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
});
export const WishlistProduct = sequelize.define<WishlistProductModel>(
    'wishlist_product',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        productId: { type: DataTypes.INTEGER, allowNull: false },
        wishlistId: { type: DataTypes.INTEGER, allowNull: false },
    },
);

export const Product = sequelize.define<ProductModel>('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, allowNull: false },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        unique: false,
        allowNull: true,
    },
    averageRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    price: { type: DataTypes.FLOAT, allowNull: false },
    discountPrice: { type: DataTypes.FLOAT, allowNull: true },
    typeId: { type: DataTypes.INTEGER, allowNull: false },
});

export const ProductInfo = sequelize.define<ProductInfoModel>('product_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, allowNull: false },
    text: { type: DataTypes.STRING, unique: false, allowNull: false },
});

export const ProductColorsGroup = sequelize.define<ProductColorsGroupModel>(
    'product_group',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    },
);

export const Discount = sequelize.define<DiscountModel>('discount', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    percent: { type: DataTypes.INTEGER, unique: false, allowNull: false },
    startsIn: { type: DataTypes.BIGINT, allowNull: false },
    expiresIn: { type: DataTypes.BIGINT, unique: false, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
});
export const Type = sequelize.define<TypeModel>('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});
export const Review = sequelize.define<ReviewModel>('review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
});
export const Like = sequelize.define<LikeModel>('like', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    reviewId: { type: DataTypes.INTEGER, allowNull: false },
});

// User
User.hasOne(Cart, {
    foreignKey: 'userId',
});
Cart.belongsTo(User);

User.hasOne(Wishlist, {
    foreignKey: 'userId',
});
Wishlist.belongsTo(User);

User.hasMany(Review, {
    foreignKey: 'userId',
});
Review.belongsTo(User);

User.hasMany(Like, {
    foreignKey: 'userId',
});
Like.belongsTo(User);

User.hasMany(Address, {
    foreignKey: 'userId',
});
Address.belongsTo(User);

User.hasMany(Order, {
    foreignKey: 'userId',
});
Order.belongsTo(User);

// Cart
Cart.hasMany(CartProduct, {
    foreignKey: 'cartId',
});
CartProduct.belongsTo(Cart);

// Wishlist
Wishlist.hasMany(WishlistProduct, {
    foreignKey: 'wishlistId',
});
WishlistProduct.belongsTo(Wishlist);

// ProductColorsGroup
ProductColorsGroup.hasMany(Product, { foreignKey: 'productGroupId' });
Product.belongsTo(ProductColorsGroup);

// Product
Product.hasOne(Discount, {
    foreignKey: 'productId',
});
Discount.belongsTo(Product);

Product.hasMany(ProductInfo);
ProductInfo.belongsTo(Product);

Product.hasMany(Review, {
    foreignKey: 'productId',
});
Review.belongsTo(Product);

Product.hasMany(WishlistProduct, {
    foreignKey: 'productId',
});
WishlistProduct.belongsTo(Product);

Product.hasMany(CartProduct, {
    foreignKey: 'productId',
});
CartProduct.belongsTo(Product);

Product.hasMany(OrderProduct, {
    foreignKey: 'productId',
});
OrderProduct.belongsTo(Product);

// Type
Type.hasMany(Product, {
    foreignKey: 'typeId',
});
Product.belongsTo(Type);

// Address
Address.hasMany(Order);
Order.belongsTo(Address, {
    foreignKey: 'addressId',
});

// Order
Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Order, {
    foreignKey: 'orderId',
});
