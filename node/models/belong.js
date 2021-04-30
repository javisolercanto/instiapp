'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Belong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };

  Belong.init({
    confirmed: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.TINYINT
    },
  }, {
    sequelize,
    modelName: 'belong',
  });
  return Belong;
};