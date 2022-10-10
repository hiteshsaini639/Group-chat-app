const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user");

function isNotValid(str) {
  if (str == undefined || str.length === 0) return true;
  else return false;
}

exports.postUser = (req, res, next) => {
  const { name, email, phone, password } = req.body;
  if (
    isNotValid(name) ||
    isNotValid(email) ||
    isNotValid(phone) ||
    isNotValid(password)
  ) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        throw { type: "error", message: "User Already Exists!" };
      } else return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => {
      return User.create({ name, email, phone, password: hash });
    })
    .then(() => {
      res.status(201).send({ type: "success", message: "Signup Successful." });
    })
    .catch((err) => {
      if (err.type === "error") {
        res.status(403).send(err);
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
};
