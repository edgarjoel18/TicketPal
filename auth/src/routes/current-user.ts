import { requireAuth } from "@ecticketsrecent/common";
import express from "express";
import jwt from "jsonwebtoken";
import { currentUser } from "@ecticketsrecent/common";
const router = express.Router();
//requireAuth
router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
