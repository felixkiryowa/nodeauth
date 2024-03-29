'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    auth_id:DataTypes.STRING,
    token: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
