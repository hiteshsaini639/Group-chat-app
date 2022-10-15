const Group = require("../models/group");
const User = require("../models/user");
const { get } = require("../routes/user");

exports.postGroup = (req, res, next) => {
  const groupName = req.body.group;
  Group.create({ name: groupName })
    .then((group) => {
      return req.user.addGroup(group, { through: { admin: true } });
    })
    .then((result) => {
      res.status(201).send({
        type: "success",
        message: `Group ${groupName} is created.`,
        groupId: result[0].groupId,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.getGroup = (req, res, next) => {
  let allUsers, group;
  const groupId = req.params.groupId;
  Group.findByPk(groupId)
    .then((g) => {
      group = g;
      return group.getUsers();
    })
    .then((users) => {
      allUsers = users;
      return group.getMessages();
    })
    .then((msgs) => {
      res.send({ msgs: msgs, users: allUsers, user: req.user.name });
    });
};

exports.getAllGroup = (req, res, next) => {
  req.user.getGroups().then((groups) => {
    res.send(groups);
  });
};

exports.addUser = (req, res, next) => {
  const groupId = req.params.groupId;
  const userEmail = req.body.userEmail;
  let userExist;
  User.findOne({ where: { email: userEmail } })
    .then((user) => {
      if (!user) {
        throw { type: "error", message: "User Not Found!" };
      } else {
        userExist = user;
        return Group.findByPk(groupId);
      }
    })
    .then((group) => {
      return group.addUser(userExist);
    })
    .then(() => {
      res.status(200).send({
        type: "success",
        message: `User ${userExist.name} is added.`,
        user: userExist.name,
      });
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
