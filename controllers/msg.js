const { where } = require("sequelize");
const Message = require("../models/msg");
const { Op } = require("sequelize");

exports.postMsg = (req, res, next) => {
  req.user
    .createMessage({ message: req.body.msg, sender: req.user.name })
    .then((message) => {
      res.status(200).send(message);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.getMsg = (req, res, next) => {
  const lastMsg = +req.query.lastMsg;
  Message.findAll({
    where: {
      id: {
        [Op.gt]: lastMsg,
      },
    },
  })
    .then((msgs) => {
      res.status(200).send({ msgs: msgs, user: req.user.name });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
