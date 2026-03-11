import express from "express";
import { registerUser, loginUser, verifyOtp } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.get("/me", protect, (req, res) => {
    res.status(200).json(req.user);
});

export default router;
