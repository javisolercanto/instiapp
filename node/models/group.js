'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static validate(group) {
      if (!group.name || group.name.length < 5 || group.name.length > 100)
        return { response: 400, error: 'Name must be between 5 and 100 characters' }
      if (!group.description || group.description.length < 5 || group.description.length > 255)
        return { response: 400, error: 'Description must be between 5 and 255 characters' }
      if (!group.price || group.price <= 0 || group.price > 9999)
        return { response: 400, error: 'Price must be between 0€ and 9999€' }

      return { response: 200, group: group }
    }
  };

  Group.init({
    name: {
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
    days: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'group',
  });
  return Group;
};