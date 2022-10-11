const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/user");
const msgRoutes = require("./routes/msg");
const sequelize = require("./util/database");
const User = require("./models/user");
const Message = require("./models/msg");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/msg", msgRoutes);

app.use("/", (req, res, next) => {
  res.status(404).send("<h1>Oops...Page Not Found</h1>");
});

User.hasMany(Message);
Message.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
