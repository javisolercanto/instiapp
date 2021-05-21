'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.code = require('./code.js')(sequelize, Sequelize);
db.user = require('./user.js')(sequelize, Sequelize);
db.category = require('./category')(sequelize, Sequelize);
db.product = require('./product')(sequelize, Sequelize);
db.location = require('./location')(sequelize, Sequelize);
db.route = require('./route')(sequelize, Sequelize);
db.rental = require('./rental')(sequelize, Sequelize);
db.post = require('./post')(sequelize, Sequelize);
db.group = require('./group')(sequelize, Sequelize);
db.belong = require('./belong')(sequelize, Sequelize);

db.code.belongsTo(db.user);
db.user.hasMany(db.code);

db.product.belongsTo(db.user, { onDelete: 'cascade' });
db.product.belongsTo(db.category);
db.user.hasMany(db.product);

db.route.belongsTo(db.user, { onDelete: 'cascade' });
db.route.belongsTo(db.location);
db.user.hasMany(db.route);

db.rental.belongsTo(db.user, { onDelete: 'cascade' });
db.rental.belongsTo(db.location);
db.user.hasMany(db.rental);

db.post.belongsTo(db.user, { onDelete: 'cascade' });
db.post.belongsTo(db.post, { as: 'parent', onDelete: 'cascade' });
db.post.belongsTo(db.category);
db.user.hasMany(db.post);


db.user.belongsToMany(db.post, {
  through: 'reactions',
});
db.post.belongsToMany(db.user, {
  through: 'reactions',
});

db.group.belongsTo(db.location);
db.group.belongsTo(db.user);

db.belong.belongsTo(db.user, { onDelete: 'cascade' });
db.belong.belongsTo(db.group, { onDelete: 'cascade' });
db.group.hasMany(db.belong);

// Sync SQL with Sequelize Models USE CAUTION
// sequelize.sync({ alter: true });

module.exports = db;
