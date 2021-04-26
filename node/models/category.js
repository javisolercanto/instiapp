'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static validate(category) {
      if (!category.name || category.name.length < 5 || category.name.length > 100)
        return { response: 400, error: 'Name must be between 5 and 100 characters' }

      return { response: 200, category: category }
    }
  };
  Category.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'category',
  });
  return Category;
};