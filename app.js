const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/user");
const msgRoutes = require("./routes/msg");
const groupRoutes = require("./routes/group");
const sequelize = require("./util/database");
const User = require("./models/user");
const Message = require("./models/msg");
const Group = require("./models/group");
const GroupUser = require("./models/group-user");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/msg", msgRoutes);
app.use("/group", groupRoutes);

app.use("/", (req, res, next) => {
  res.status(404).send("<h1>Oops...Page Not Found</h1>");
});

Group.hasMany(Message);
Message.belongsTo(Group);
Group.belongsToMany(User, { through: GroupUser });
User.belongsToMany(Group, { through: GroupUser });

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
