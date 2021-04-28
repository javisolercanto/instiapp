'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rental extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static validate(rental) {
      if (!rental.title || rental.title.length < 5 || rental.title.length > 100)
        return { response: 400, error: 'Title must be between 5 and 100 characters' }
      if (!rental.description || rental.description.length < 5 || rental.description.length > 100)
        return { response: 400, error: 'Description must be between 5 and 100 characters' }
      if (!rental.price || rental.price <= 0 || rental.price > 9999)
        return { response: 400, error: 'Price must be between 0€ and 9999€' }

      return { response: 200, rental: rental }
    }
  };

  Rental.init({
    title: {
      allowNull: true,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
  }, {
    sequelize,
    modelName: 'rental',
  });
  return Rental;
};