'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static validate(user, validatePassword = true) {
      if (!user.name || user.name.length < 5 || user.name.length > 100)
        return { response: 400, error: 'Name must be between 5 and 100 characters' }
      if (!user.username || user.username.length < 3 || user.username.length > 50)
        return { response: 400, error: 'Username must be between 3 and 50 characters' }
      if (validatePassword && (!user.password || user.password.length < 8 || user.password.length > 100))
        return { response: 400, error: 'Password must be between 8 and 100 characters' }

      return { response: 200, user: user }
    }
  };
  User.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    image: {
      allowNull: false,
      defaultValue: 'https://i.ibb.co/dpNjfS7/default-avatar.png',
      type: DataTypes.STRING
    },
    admin: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.TINYINT
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return User;
};