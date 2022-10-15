const express = require("express");

const msgController = require("../controllers/msg");
const authenticateMiddleware = require("../middlerwares/auth");

const router = express.Router();

router.post(
  "/send/:groupId",
  authenticateMiddleware.authenticate,
  msgController.postMsg
);

router.get("/get", authenticateMiddleware.authenticate, msgController.getMsg);

module.exports = router;
