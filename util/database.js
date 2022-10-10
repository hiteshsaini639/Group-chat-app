const Sequelize = require("sequelize");

const sequelize = new Sequelize("group-chat", "root", "ikka@#4321", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
