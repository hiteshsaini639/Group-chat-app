const express = require("express");

const groupController = require("../controllers/group");
const authenticateMiddleware = require("../middlerwares/auth");

const router = express.Router();

router.post(
  "/create",
  authenticateMiddleware.authenticate,
  groupController.postGroup
);

router.post(
  "/add-user/:groupId",
  authenticateMiddleware.authenticate,
  groupController.addUser
);

router.get(
  "/get/:groupId",
  authenticateMiddleware.authenticate,
  groupController.getGroup
);

router.get(
  "/get",
  authenticateMiddleware.authenticate,
  groupController.getAllGroup
);

// router.post("/login", userController.loginUser);

module.exports = router;
