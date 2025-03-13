import express from "express";
const router = express.Router();

router.get("/test", (req, res) => {
    console.log("Test route hit!");
    res.send("API is working!");
});

export default router;
