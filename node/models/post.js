'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static validate(post) {
      if (!post.title || post.title.length < 5 || post.title.length > 100)
        return { response: 400, error: 'Name must be between 5 and 100 characters' }
      if (!post.content || post.content.length < 1 || post.content.length > 255)
        return { response: 400, error: 'Content must be between 1 and 255 characters' }

      return { response: 200, post: post }
    }
  };
  Post.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    content: {
      allowNull: true,
      type: DataTypes.STRING
    },
    resolved: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
  }, {
    sequelize,
    modelName: 'post',
  });
  return Post;
};