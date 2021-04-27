'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static validate(location) {
      if (!location.name || location.name.length < 5 || location.name.length > 100)
        return { response: 400, error: 'Name must be between 5 and 100 characters' }
      if (location.latitude && location.latitude.length < 5 || location.latitude.length > 20)
        return { response: 400, error: 'Latitude must be between 5 and 20 characters' }
      if (location.longitude && location.longitude.length < 5 || location.longitude.length > 20)
        return { response: 400, error: 'Longitude must be between 5 and 20 characters' }

      return { response: 200, location: location }
    }
  };

  Location.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    latitude: {
      allowNull: true,
      type: DataTypes.STRING
    },
    longitude: {
      allowNull: true,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'location',
  });
  return Location;
};