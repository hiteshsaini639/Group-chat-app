const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const GroupUser = sequelize.define("groupusers", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
});

module.exports = GroupUser;
