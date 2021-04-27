'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static validate(product) {
      if (!product.name || product.name.length < 5 || product.name.length > 100)
        return { response: 400, error: 'Name must be between 5 and 100 characters' }
      if (!product.description || product.description.length < 1 || product.description.length > 255)
        return { response: 400, error: 'Description must be between 1 and 255 characters' }
      if (!product.price || product.price <= 0 || product.price > 9999)
        return { response: 400, error: 'Price must be between 0€ and 9999€' }

      return { response: 200, product: product }
    }
  };
  Product.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    image: {
      allowNull: false,
      defaultValue: 'https://i.ibb.co/dpNjfS7/default-image.png',
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'product',
  });
  return Product;
};