'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static validate(route) {
      if (!route.title || route.title.length < 5 || route.title.length > 100)
        return { response: 400, error: 'Title must be between 5 and 100 characters' }
      if (!route.description || route.description.length < 5 || route.description.length > 100)
        return { response: 400, error: 'Description must be between 5 and 100 characters' }
      if (!route.price || route.price <= 0 || route.price > 9999)
        return { response: 400, error: 'Price must be between 0€ and 9999€' }
      if (!route.seats || route.seats <= 0 || route.seats > 100)
        return { response: 400, error: 'Seats must be between 1 and 100' }
      if (!route.date || !new Date(route.date) < new Date())
        return { response: 400, error: 'If you don\'t have a time machine that date it\'s imposible to be correct' }

      return { response: 200, route: route }
    }
  };

  Route.init({
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
    seats: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'route',
  });
  return Route;
};