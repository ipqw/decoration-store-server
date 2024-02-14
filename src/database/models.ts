import sequelize from '../../db';
import { DataTypes } from 'sequelize';

export const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, unique: false, allowNull: false },
    lastName: { type: DataTypes.STRING, unique: false, allowNull: false },
    displayName: { type: DataTypes.STRING, unique: false, allowNull: false },
    imageUrl: { type: DataTypes.STRING, unique: false, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'USER' },
});

export const Address = sequelize.define('address', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    recipientName: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.INTEGER, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    zipcode: { type: DataTypes.INTEGER, allowNull: true },
    street: { type: DataTypes.STRING, allowNull: false },
    houseNumber: { type: DataTypes.INTEGER, allowNull: false },
});

export const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
});

export const Cart = sequelize.define('cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});
export const CartProduct = sequelize.define('cart_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
});

export const Wishlist = sequelize.define('wishlist', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});
export const WishlistProduct = sequelize.define('wishlist_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
});

export const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, allowNull: false },
    imageUrl: { type: DataTypes.STRING, unique: false, allowNull: true },
    averageRate: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    price: { type: DataTypes.FLOAT, allowNull: false },
    discountPrice: { type: DataTypes.FLOAT, allowNull: false },
});
export const Discount = sequelize.define('discount', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    percent: { type: DataTypes.INTEGER, unique: false, allowNull: false },
    expiresIn: { type: DataTypes.INTEGER, unique: false, allowNull: false },
});
export const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});
export const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.STRING, unique: true, allowNull: false },
    text: { type: DataTypes.STRING, unique: true, allowNull: false },
});
export const Like = sequelize.define('like', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// User
User.hasOne(Cart);
Cart.belongsTo(User);

User.hasOne(Wishlist);
Wishlist.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

User.hasMany(Like);
Like.belongsTo(User);

User.hasMany(Address);
Address.belongsTo(User);

// Cart
Cart.hasMany(CartProduct);
CartProduct.belongsTo(Cart);

// Wishlist
Wishlist.hasMany(WishlistProduct);
WishlistProduct.belongsTo(Wishlist);

// Product
Product.hasMany(Discount);
Discount.belongsTo(Product);

Product.hasMany(Rating);
Rating.belongsTo(Product);

// Type
Type.hasMany(Product);
Product.belongsTo(Type);

// Order
Order.hasOne(Address);
Address.belongsTo(Order);
