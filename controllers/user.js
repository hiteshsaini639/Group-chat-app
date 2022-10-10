const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
        throw { type: "error", message: "User Already Exists! Please Login." };
      } else return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => {
      return User.create({ name, email, phone, password: hash });
    })
    .then(() => {
      res
        .status(201)
        .send({ type: "success", message: "Successfully Signup." });
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

exports.loginUser = (req, res, next) => {
  let existingUser;
  const { email, password } = req.body;
  if (isNotValid(email) || isNotValid(password)) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        throw { type: "error", message: "User Not Found!" };
      } else {
        existingUser = user;
        return bcrypt.compare(password, user.password);
      }
    })
    .then((result) => {
      if (result) {
        const token = jwt.sign(
          {
            userId: existingUser.id,
            userEmail: existingUser.email,
          },
          process.env.TOKEN_SECRET_KEY
        );
        res.status(200).send(token);
      } else {
        res.status(401).send({ type: "error", message: "Wrong Password!" });
      }
    })
    .catch((err) => {
      if (err.type === "error") {
        res.status(404).send(err);
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
};
